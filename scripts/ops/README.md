# scripts/ops: alertas, backups y mantenimiento

Todo corre solo. Las claves y el topic de ntfy viven FUERA del repo (es público).

| Qué | Dónde corre | Cuándo | Archivo |
|---|---|---|---|
| Vigilante del sitio + failover + aviso al móvil | VM de Oracle (`fc-failover.timer`, root) | cada minuto | `fc-failover.sh` → `/usr/local/bin/fc-failover.sh` |
| Vigilante inverso (VM caída, o VM sirviendo con la PC ya sana) | Mini PC (cron) | cada 5 min | `watch_vm.sh` |
| Backup cifrado a la VM (14 diarios) | Mini PC (cron) | 03:45 (Madrid) | `backup.sh` + `redis_dump.mjs` |
| Rotación de logs + limpieza de /tmp + aviso de disco ≥85 % | Mini PC (cron) | 05:15 (Madrid) | `housekeeping.sh` + `logrotate.conf` |
| Envío de avisos (ntfy + Telegram) | ambas | — | `notify.mjs` |

Instalar o actualizar tras cambiar algo de esta carpeta:

```bash
bash scripts/ops/install_local.sh   # copia a ~/.local/lib/fc-ops y añade al crontab lo que falte
bash scripts/ops/install_vm.sh      # copia fc-failover.sh y notify.mjs a la VM
```

Estado y logs en la Mini PC: `~/.local/state/fc-ops/` (`watch_vm.log`, `backup.log`, `housekeeping.log`).
En la VM: `/var/tmp/fc-failover.count` (fallos seguidos) y `/var/tmp/fc-failover.down` (ya avisé de la caída).

## Avisos al móvil

Un aviso por cambio de estado (cae / vuelve), nunca uno por minuto. Si un aviso no
sale (red, ntfy caído), se reintenta en la siguiente comprobación.

- **ntfy (ya activo):** instala la app **ntfy** en el iPhone (App Store), pulsa **+**,
  escribe el topic que hay en `~/.config/fc-alerts.env` de la Mini PC (`NTFY_TOPIC=…`),
  servidor `ntfy.sh` (el de por defecto) y **Subscribe**. Activa las notificaciones de
  la app. Quien conozca el topic puede leer y escribir en él: no lo publiques.
- **Telegram (cuando se despliegue la rama):** envía `/start alertas` a
  [@FootballCultBot](https://t.me/FootballCultBot?start=alertas). Tu chat queda guardado
  en Redis (`opsAlertChats`) y desde entonces los avisos llegan también por Telegram.
  Solo el primer chat que lo pide queda registrado; para cambiarlo: `DEL opsAlertChats`.
- Probar a mano: `node ~/.local/lib/fc-ops/notify.mjs "Prueba" "hola"`.

Qué avisa cada uno:
- VM: `🔴 football-cult.com caído` tras 3 fallos seguidos (y arranca el conector de
  respaldo), `✅ vuelve a responder` (dice si lo está sirviendo la VM).
- Mini PC: `⚠️ VM de respaldo caída` (SSH o su fc-web fallan 10 min), `✅ VM OK de nuevo`,
  y `🟡 La Mini PC volvió y la VM sigue sirviendo` → parar el respaldo con
  `ssh -i ~/.ssh/oracle_fc opc@51.170.44.144 sudo systemctl stop fc-cloudflared`.
  Si la Mini PC no tiene internet no hace nada (de la caída del sitio ya avisa la VM).

## Backups

Cada noche `backup.sh` sube a la VM `/home/opc/backups/fc-AAAA-MM-DD.tar.gz.enc`
(~40 MB, AES-256 con `openssl`, se guardan los 14 últimos). Contiene:

- `.env.local` del repo, `~/fc-data/` (clics y seguidores de Telegram), `~/.cloudflared/`
  (credenciales del túnel), `~/.ssh/oracle_fc*`, `~/.oci`, `~/.config/fc-alerts.env`;
- los archivos del repo que no están en git (estado de minería `mined_*.json`,
  `image_ok.json`, `boot_image_pairs.json`, logs...), lista en `repo-files.lst`;
- `redis.json`: TODO Redis legible (usuarios, suscripciones de alertas de precio,
  `lastPrice:*`, `opsAlertChats`);
- `repo.bundle`: `git bundle --all` del repo (incluye commits sin empujar).

**La clave es `~/.config/fc-backup.key` y solo está en la Mini PC.** Si el disco
muere, sin una copia de esa clave los backups no sirven: guárdala en tu gestor de
contraseñas (`cat ~/.config/fc-backup.key`, una línea).

### Recuperación (probada el 2026-10-09 en un directorio temporal)

```bash
# 1. Recuperar la clave en ~/.config/fc-backup.key (chmod 600) y bajar el último backup
scp -i ~/.ssh/oracle_fc opc@51.170.44.144:'backups/fc-*.tar.gz.enc' .   # o solo el último
# 2. Descifrar y extraer
mkdir r && openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 \
  -pass file:$HOME/.config/fc-backup.key -in fc-AAAA-MM-DD.tar.gz.enc | tar -xzf - -C r
# 3. Repo con todo su historial
git clone -b main r/repo.bundle football-cult && cd football-cult
git remote set-url origin https://github.com/smargueirat/football-cult.git
cp ../r/.env.local . && (cd ../r && tar -cf - -T repo-files.lst) | tar -xf -   # datos sin git
npm ci
# 4. Datos de fuera del repo (rutas absolutas guardadas como home/piojo/...)
cp -a ../r/home/piojo/fc-data ../r/home/piojo/.cloudflared ~/ ; cp -a ../r/home/piojo/.ssh/oracle_fc* ~/.ssh/
# 5. Redis (solo si se perdió): en una Redis vacía, con su REDIS_URL en .env.local
node scripts/ops/redis_dump.mjs restore ../r/redis.json   # --force si no está vacía
# 6. Publicar: scripts/deploy_local.sh, y bash scripts/ops/install_local.sh
```

Prueba hecha: descifrado OK; `.env.local`, `.cloudflared`, `oracle_fc`, `fc-data` y
`mined_apparel.json`/`image_ok.json`/`boot_image_pairs.json` idénticos byte a byte al
original; `git clone` del bundle llega a `main`; Redis restaurado en una Redis local
de prueba (docker): 9.039 claves, 0 diferencias.

## Wifi y arranque tras un corte de luz (requiere sudo / BIOS: hazlo tú)

La caída de 15 h del 6-7 oct fue un corte de luz y la PC no volvió a arrancar sola.
Además el driver `rtw89` (chip RTL8851BE) tiene microcortes (13 en 39 h), con el error
`firmware failed to ack for entering ps mode` (el ahorro de energía del wifi).

**1. Ahorro de energía del wifi.** Esta PC **no usa NetworkManager** (no está instalado:
netplan + systemd-networkd + wpa_supplicant), así que `wifi.powersave = 2` no tendría
efecto. El equivalente es desactivarlo en el driver y en la interfaz:

```bash
sudo tee /etc/modprobe.d/rtw89-fc.conf >/dev/null <<'EOF'
options rtw89_core disable_ps_mode=Y
options rtw89_pci disable_aspm_l1=Y disable_aspm_l1ss=Y disable_clkreq=Y
EOF
sudo apt install -y iw
echo 'ACTION=="add", SUBSYSTEM=="net", KERNEL=="wlp2s0", RUN+="/usr/sbin/iw dev wlp2s0 set power_save off"' \
  | sudo tee /etc/udev/rules.d/70-wifi-powersave-off.rules
sudo reboot   # el sitio cae 1-2 min; mejor de madrugada
```

Comprobar tras reiniciar: `cat /sys/module/rtw89_core/parameters/disable_ps_mode` → `Y`
y `iw dev wlp2s0 get power_save` → `Power save: off`.
(Si algún día se instala NetworkManager, lo equivalente sería
`printf '[connection]\nwifi.powersave = 2\n' | sudo tee /etc/NetworkManager/conf.d/wifi-powersave-off.conf && sudo systemctl restart NetworkManager`.)

**2. Encender sola tras un corte de luz (BIOS/UEFI).** Es un ajuste de la placa, no del
sistema. BIOS AMI Aptio (`V1.0_263`): al encender pulsa **Supr/Del** (o F2/F7) y busca en
*Chipset* / *Advanced* / *Power* una opción llamada **"Restore on AC Power Loss"**,
**"AC Power Loss"**, **"Power On After Power Fail"** o **"State After G3"**. Ponla en
**Power On** (o **S0 State**), guarda con F10. Prueba: con la PC encendida, desenchufa el
cable, espera 10 s, vuelve a enchufar: debe arrancar sin tocar el botón. `fc-web` y
`fc-tunnel` ya arrancan solos al encender (linger activo).

## Limpieza

`housekeeping.sh` (cada día): rota `scripts/*.log`, `scripts/*/*.log` y los logs de
`~/.local/state/fc-ops` al pasar de 1 MB (4 copias, comprimidas, `copytruncate` para
no cortar a los cron que escriben con `>>`); en `/tmp` (en RAM) borra la caché de tsx
de más de 7 días, los feeds de `/tmp/feeds` que nadie ha refrescado en 14 días (el
escaneo solo acepta <24 h) y lo suelto de este usuario sin tocar en 14 días. Nunca
toca `/tmp/claude-*`, tmux ni ocultos. Avisa al móvil si el disco pasa del 85 %.

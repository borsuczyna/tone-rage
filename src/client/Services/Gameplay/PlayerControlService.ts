import { Input, InputGroup, PlayerControlType } from "@shared-rage/Models/PlayerControlType";
import Logger from "@shared/Logger";

export default class PlayerControlService {
    private static logger: Logger = Logger.getLogger(PlayerControlService);
    private static disabledControls: Set<PlayerControlType> = new Set();

    public static init() {
        mp.events.add('render', this.updateControls.bind(this));
    }

    public static updateControls() {
        this.setControlEnabled(PlayerControlType.Fight, false);
        this.setControlEnabled(PlayerControlType.SwitchWeapon, true);
        this.setControlEnabled(PlayerControlType.WeaponWheel, false);
        this.setControlEnabled(PlayerControlType.Aim, false);
        this.setControlEnabled(PlayerControlType.Fire, false);
    }

    public static isControlEnabled(controlType: PlayerControlType): boolean {
        return !this.disabledControls.has(controlType);
    }

    public static setControlEnabled(controlType: PlayerControlType, enabled: boolean): void {
        const action = enabled ? mp.game.controls.enableControlAction : mp.game.controls.disableControlAction;

        switch (controlType) {
            case PlayerControlType.Fight:
                action(InputGroup.Max, Input.Attack, true);
                action(InputGroup.Max, Input.Attack2, true);
                action(InputGroup.Max, Input.Aim, true);
                action(InputGroup.Max, Input.MeleeAttack1, true);
                action(InputGroup.Max, Input.MeleeAttack2, true);
                break;

            case PlayerControlType.SwitchWeapon:
                action(InputGroup.Max, Input.SelectNextWeapon, true);
                action(InputGroup.Max, Input.SelectPrevWeapon, true);
                break;

            case PlayerControlType.WeaponWheel:
                action(InputGroup.Max, Input.WeaponWheelNext, true);
                action(InputGroup.Max, Input.WeaponWheelPrev, true);

                // vehicle weapon controls
                action(InputGroup.Max, Input.VehAttack, true);
                action(InputGroup.Max, Input.VehAttack2, true);
                action(InputGroup.Max, Input.VehAim, true);
                action(InputGroup.Max, Input.VehGunLr, true);
                action(InputGroup.Max, Input.VehGunUd, true);
                break;

            case PlayerControlType.Aim:
                // prevent aiming in vehicles
                mp.game.player.setCanDoDriveBy(!enabled);
                action(InputGroup.Max, Input.Aim, true);
                break;

            case PlayerControlType.Fire:
                mp.game.player.disableFiring(!enabled);
                break;

            default:
                this.logger.warn(`setControlEnabled: Unhandled control type ${controlType}`);
                return;
        }
    }
}
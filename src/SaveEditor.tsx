import { createSignal, createUniqueId } from "solid-js";
import { SaveFile } from "./Savefile.js";
import { Storage } from './Storage.jsx';

import {serialize, deserialize} from 'bson';
import { loadOptionsFromSavefile, modifySavefile } from "./modifySavefile.js";

type CheckboxInputProps = {
    onChange: (v: boolean) => void,
    label: string,
    help?: string,
    initial?: boolean,
}

function Checkbox(props: CheckboxInputProps) {
    const id = createUniqueId();
    const helpId = `${id}-help`

    return (
        <div class="mb-3 form-check">
            <input
                onChange={(e) => props.onChange((e.target as HTMLInputElement).checked)}
                checked={props.initial ?? false}
                type="checkbox"
                class="form-check-input"
                id={id}
                aria-discribedby={helpId}
            />
            <label class="form-check-label" for={id}>
                {props.label}
            </label>
            {props.help && <div id={helpId} class="form-text">
                {props.help}
            </div>}
        </div>
    )
}

type NumberInputProps = {
    onChange: (n: number) => void,
    label: string,
    help?: string,
    initial?: number,
    min?: number,
    max?: number,
}

function NumberInput(props: NumberInputProps) {
    const id = createUniqueId();
    const helpId = `${id}-help`

    return (
        <div class="mb-3">
            <label for={id} class="form-label">
                {props.label}
            </label>
            <input
                onChange={(e) => props.onChange(parseInt((e.target as HTMLInputElement).value, 10))}
                value={props.initial ?? 0}
                id={id}
                type="number"
                min={props.min ?? 0}
                max={props.max ?? Number.MAX_SAFE_INTEGER}
                class="form-control"
                aria-describedby={helpId}
            />
            {props.help && <div id={helpId} class="form-text">
                {props.help}
            </div>}
        </div>
    );
}

const FormParts = {
    'basic': [
        ['cash', 'Cash', 'number',],
        ['upgradePoints', 'Upgrade points', 'number',],
        ['health', 'Health', 'number',],
        ['ammo_handgun', 'Handgun ammo', 'number',],
        ['ammo_rifle', 'Rifle ammo', 'number',],
        ['ammo_shotgun', 'Shotgun ammo', 'number',],
        ['ammo_smg', 'SMG ammo', 'number',],
        ['ammo_explosive', 'Bazooka ammo', 'number',],
        ['ammo_minigun', 'Minigun ammo', 'number',],
    ],
    'upgrades': [
        ['upgrade_InventoryCapacity', 'Inventory capacity (max 6)', 'number',],
        ['upgrade_AutoCase', 'Autocasing of houses (max 1)', 'number',],
        ['upgrade_MetalDetector', 'Metal detector (max 1)', 'number',],
        ['upgrade_ImprovedSprint', 'Improved sprint (max 5)', 'number',],
        ['upgrade_IncreaseHoldUpChance', 'Improved holdup (max 3)', 'number',],
        ['upgrade_ImprovedSneak', 'Improved sneak (max 3)', 'number',],
        ['upgrade_AutoHealth', 'Auto consumables (max 1)', 'number',],
        ['upgrade_IncreaseRestrainChance', 'Improve restrain (max 3)', 'number',],
        ['upgrade_IncreaseMaxHealth', 'Improve max. health (max 6)', 'number',],
        ['upgrade_ReduceVehicleDamage', 'Reduce vehicle damage (max 6)', 'number',],
        ['upgrade_IncreaseAttackChance', 'Increase attack chance (max 3)', 'number',],
        ['upgrade_RegenerateHealth', 'Health regen (max 3)', 'number',],
        ['upgrade_WeldingTorch', 'Repair cars (max 1)', 'number',],
        ['upgrade_IncreaseMeleeDamage', 'Increase melee damage (max 4)', 'number',],
        ['upgrade_ExtraDamageToVehicles', 'Increase damage to vehicles (max 2)', 'number',],
        ['upgrade_IncreaseFleeChance', 'Increase flee chance (max 1)', 'number',],
        ['upgrade_SpawnWithLoadOutBag', 'Bonus loot on spawn (max 4)', 'number',],
        ['upgrade_SneakDamage', 'Increase sneak damage (max 2)', 'number',],
        ['upgrade_ReduceShopPrices', 'Reduce shop prices (max 3)', 'number',],
        ['upgrade_MeleeDisarm', 'Melee disarm (max 1)', 'number',],
    ],
    'cheats': [
        ['cheat_allAreasUnlocked', 'Unlock all areas', 'boolean',],
        ['cheat_allStashes', 'Complete all stashes', 'boolean',],
        ['cheat_allPaintings', 'Complete all paintings', 'boolean',],
        ['cheat_allJumps', 'Complete all jumps', 'boolean',],
        ['cheat_allFlyers', 'Complete all flyers', 'boolean',],
        ['cheat_allVehicles', 'Complete all unique vehicles', 'boolean',],
        ['cheat_allCarsStolen', 'Complete all cars stolen', 'boolean',],
        ['cheat_allShopsHeldUp', 'Complete all shops held up', 'boolean',],
        ['cheat_allChallengesComplete', 'Complete all challanges', 'boolean',],
        ['cheat_allChallengesGold', 'Complete all challenges with gold', 'boolean',],
        ['cheat_allRacesCompleted', 'Complete all races', 'boolean',],
        ['cheat_allRacesGold', 'Complete all races with gold', 'boolean',],
        ['cheat_goldRaceWithNoDamage', 'Complete gold race with no damage', 'boolean',],
        ['cheat_allVehiclesCrushedByTank', 'Complete vehicles crushed by tank', 'boolean',],
        ['cheat_allEnemyTanksDestroyed', 'Complete tanks destroyed', 'boolean',],
        ['cheat_rideInTrainLoop', 'Complete train in loop', 'boolean',],
    ],
} as const;

export function SaveEditor() {
    const [loadedFile, setLoadedFile] = createSignal<SaveFile | undefined>();
    const [options, setOptions] = createSignal<ReturnType<typeof loadOptionsFromSavefile> | undefined>();
    
    function changeOption(k: keyof ReturnType<typeof loadOptionsFromSavefile>, v: unknown) {
        setOptions(Object.assign({}, options(), {[k]: v}));
    }

    function renderFormPart(part: keyof typeof FormParts) {
        return FormParts[part].map(([key, label, type]) => {
            if (type === 'number') {
                return (<NumberInput
                    onChange={(n) => changeOption(key, n)}
                    label={label}
                    initial={options()[key]}
                />);
            } else if (type === 'boolean') {
                return (<Checkbox
                    onChange={(n) => changeOption(key, n)}
                    label={label}
                    initial={options()[key]}
                />);
            } else {
                return (<p>ERROR: Cannot render type <code>{type}</code></p>)
            }
        });
    }

    function promptDownload() {
        const modifiedSave = modifySavefile(loadedFile(), options());
        const bytes = serialize(modifiedSave);
        const file = new File([bytes], 'AllManagers.dat.bson');

        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = URL.createObjectURL(file),
        link.download = file.name;

        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
            URL.revokeObjectURL(link.href);
            link.parentNode.removeChild(link);
        }, 100);
    }

    function onFileSelected(_: number, c: Uint8Array) {
        const deserialized = deserialize(c) as SaveFile;
        setLoadedFile(deserialized);
        setOptions(loadOptionsFromSavefile(deserialized));
    }

    return (
        <section id="forms">
          <article class="my-3" id="overview">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Uploader</h3>
            </div>

            <Storage onFileSelected={(d, c) => onFileSelected(d, c)}></Storage>
          </article>

          {!options() && 
                <article class="my-3" id="overview">
                    <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
                    <h3>No file</h3>
                    </div>

                    <div>
                    <div class="bd-example">
                        <p class="lead">No file is loaded yet.</p>
                    </div>
                    </div>
                </article>
          }

          {options() && <article class="my-3" id="overview">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Basic options</h3>
            </div>

            <div>
              <div class="bd-example">
                <form>
                    {renderFormPart('basic')}
                </form>
              </div>
            </div>
          </article>}

          {options() && <article class="my-3" id="disabled-forms">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Upgrades</h3>
            </div>

            <div>
              <div class="bd-example">
                <form>
                    {renderFormPart('upgrades')}
                </form>
              </div>
            </div>
          </article>}

          {options() && <article class="my-3" id="sizing">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Cheats</h3>
            </div>

            <div>
              <div class="bd-example">
                <form>
                    {renderFormPart('cheats')}
                </form>
              </div>
            </div>
          </article>}

          {options() && <article class="my-3" id="input-group">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Download</h3>
            </div>

            <div>
              <div class="bd-example">
                <div class="col-12">
                <button class="btn btn-primary" type="submit" onClick={(e) => {e.preventDefault(); promptDownload()}}>
                    Download save
                </button>
            </div>
              </div>
            </div>
          </article>}
        </section>
    );
}

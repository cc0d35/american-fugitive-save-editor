import { createMemo, createSignal, createUniqueId, onMount } from "solid-js";
import {toByteArray, fromByteArray} from 'base64-js';

type StorageProps = {
    onFileSelected: (date: number, contents: Uint8Array) => void,
}

const LOCAL_STORAGE_KEY = 'american_fugitive_save_editor.storage';

type StorageItem = {
    contents: string,
    date: number,
    id: number,
    comment?: string,
}

const STORAGE_ITEM_PRELOADED_COMPLETE_SAVE_ID = -1;

export function Storage(props: StorageProps) {
    const [storageItems, setStorageItems] = createSignal<StorageItem[]>(getStorageItems());

    function getStorageItems(): StorageItem[] {
        const lsContents = localStorage.getItem(LOCAL_STORAGE_KEY);
        return JSON.parse(lsContents) ?? [];
    }

    function saveStorageItems(items: StorageItem[]) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
        setStorageItems(items);
    }

    function addFileToStorage(contents: Uint8Array, loadImmidate: boolean = true, saveAsId?: number, comment?: string) {
        const storageItems = getStorageItems();
        const id = saveAsId ? saveAsId : storageItems.reduce((acc, current) => {
            if (current.id >= acc) return current.id + 1;
            return acc;
        }, 0);
        storageItems.push({
            id,
            date: Date.now(),
            contents: fromByteArray(contents),
            comment,
        });
        saveStorageItems(storageItems);
        if (loadImmidate) loadStorageItem(id);
    }

    function removeFileFromStorage(id: number) {
        const storageItems = getStorageItems();
        const filtered = storageItems.filter(i => i.id !== id);
        saveStorageItems(filtered);
    }

    function loadStorageItem(id: number) {
        const item = storageItems().find(i => i.id === id);
        if (!item) {
            alert(`Failed to load save, please reupload.`);
            return;
        }
        props.onFileSelected(item.date, toByteArray(item.contents));
    }

    onMount(() => {
        if (!storageItems().find(i => i.id === STORAGE_ITEM_PRELOADED_COMPLETE_SAVE_ID)) {
            import('./preloadedCompleteSave.json').then(m => {
                addFileToStorage(toByteArray(m.base64), false, STORAGE_ITEM_PRELOADED_COMPLETE_SAVE_ID, 'A preloaded complete save');
            });
        }
    });

    const itemsDisplay = createMemo(() => {
        return storageItems().map(i => {
            const dateToDisplay = (new Date(i.date)).toLocaleString();
    
            return (
                    <div class="col-sm-4">
                            <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Saved Game</h5>
                                <h6 class="card-subtitle mb-2 text-muted">{dateToDisplay}</h6>
                                <p class="card-text">
                                    {i.comment && i.comment}
                                    {!i.comment && 'A backup of a save you uploaded.'}
                                </p>
                                <a href="#" class="card-link" onClick={(e) => {e.preventDefault(); loadStorageItem(i.id)}}>Load</a>
                                <a href="#" class="card-link" onClick={(e) => {e.preventDefault(); confirm('Are you sure?') && removeFileFromStorage(i.id)}}>Delete</a>
                            </div>
                        </div>
                    </div>
            )
        });
    });

    return (
        <div>
            <Uploader onFileUploaded={(c) => addFileToStorage(c)}></Uploader>
            <div class="bd-example">
                <div class="row">
                {itemsDisplay}
                </div>
            </div>
        </div>
    )
}

type UploaderProps = {
    onFileUploaded: (contents: Uint8Array) => void,
}

function Uploader(props: UploaderProps) {
    const id = createUniqueId();

    function onFileSelected(e: Event) {
        const files = (e.target as HTMLInputElement).files;
        if (files.length === 0) {
            return;
        }

        const theFile = files.item(0);
        theFile.arrayBuffer().then(b => {
            props.onFileUploaded(new Uint8Array(b));
        }).catch(window.alert).finally(() => {
            (e.target as HTMLInputElement).form.reset();
        });
    }

    return (
        <div>
            <div class="bd-example">
            <form>
                <div class="mb-3">
                <input onChange={(e) => onFileSelected(e)} type="file" class="form-control" id={id} multiple={false} />
                </div>
            </form>
            </div>
        </div>
    )
}
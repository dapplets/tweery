export class KeyValueStorage {
  constructor(private _keyValueStorageApi: string) {}

  async get(key: string): Promise<any | null> {
    const resp = await fetch('https://corsanywhere.herokuapp.com/'+this._keyValueStorageApi + '/?key=' + key);
    if (!resp.ok) throw new Error('Cannot get from key-value storage');
    return resp.json();
  }

  async set(key: string, value: any): Promise<void> {
    const resp = await fetch(this._keyValueStorageApi, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        key: key,
        value: value
      }),
    });

    if (!resp.ok) throw new Error('Cannot set to key-value storage');
  }
}

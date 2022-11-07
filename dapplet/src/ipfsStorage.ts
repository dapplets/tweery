export class IpfsStorage {
  constructor(private _ipfsGateway: string) {}

  async saveObject(object: any): Promise<string> {
    const json = JSON.stringify(object);
    const blob = new Blob([json]);
    const resp = await fetch('https://corsanywhere.herokuapp.com/'+this._ipfsGateway + '/ipfs/', {
      method: 'POST',
      body: blob,
    });

    if (!resp.ok) throw new Error('Cannot save to IPFS');

    const cid = resp.headers.get('ipfs-hash');
    return cid;
  }

  async fetchObject(cid: string): Promise<any> {
    const resp = await fetch('https://corsanywhere.herokuapp.com/'+this._ipfsGateway + '/ipfs/' + cid);
    if (!resp.ok) throw new Error('Cannot fetch from IPFS');
    
    const json = await resp.text();
    const object = JSON.parse(json);
    return object;
  }
}

import {} from '@dapplets/dapplet-extension';


@Injectable
export default class TwitterFeature {
  @Inject('twitter-adapter.dapplet-base.eth') public adapter: any;
  private _overlay: any;


  async activate(): Promise<void> {
  
   
  
    Core.onAction(() => this.openOverlay());
  

    this.adapter.attachConfig({
      
      
    });
  }
  async openOverlay(props?: any): Promise<void> {
    this._overlay.send('data', props);
  }
}

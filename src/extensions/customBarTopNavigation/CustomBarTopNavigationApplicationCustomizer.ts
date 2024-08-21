import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';

import * as React from 'react';
import * as ReactDom from 'react-dom';
//import * as strings from 'CustomBarTopNavigationApplicationCustomizerStrings';
import QuickLinks, { IQuickLinksProps } from './components/QuickLinks';

import * as strings from 'CustomBarTopNavigationApplicationCustomizerStrings';

const LOG_SOURCE: string = 'CustomBarTopNavigationApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ICustomBarTopNavigationApplicationCustomizerProperties {
  listTitle: string;
  titleField: string;
  urlField: string;
  iconField: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class CustomBarTopNavigationApplicationCustomizer
  extends BaseApplicationCustomizer<ICustomBarTopNavigationApplicationCustomizerProperties> {

    private _topPlaceholder: PlaceholderContent | undefined;
    public onInit(): Promise<void> {
      Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
  
      // Wait for the placeholders to be created (or handle them being changed) and then render.
      this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
  
      return Promise.resolve();
    }

    private _renderPlaceHolders(): void {
      console.log('CustomBarTopNavigationApplicationCustomizer._renderPlaceHolders()');
  
      // Check if the top placeholder is already set
      if (!this._topPlaceholder) {
        this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
          PlaceholderName.Top,
          { onDispose: this._onDispose });
  
        // The extension should be rendering something
        if (this._topPlaceholder) {
          const element: React.ReactElement<IQuickLinksProps> = React.createElement(
            QuickLinks,
            {
              context: this.context,
              listTitle: this.properties.listTitle,
              titleField: this.properties.titleField,
              urlField: this.properties.urlField,
              iconField: this.properties.iconField
            }
          );
  
          ReactDom.render(element, this._topPlaceholder.domElement);
        }
      }
    }
  
    private _onDispose(): void {
      console.log('[CustomBarTopNavigationApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
    }
    
  }
  


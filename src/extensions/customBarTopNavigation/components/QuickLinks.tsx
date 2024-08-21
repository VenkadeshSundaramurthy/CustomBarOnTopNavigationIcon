import * as React from 'react';
import { Icon } from '@fluentui/react';
import styles from '../CustomBarTopNavigationApplicationCustomizer.module.scss';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export interface IQuickLink {
  title: string;
  url: string;
  iconName: string;
}

export interface IQuickLinksProps {
  context: any;
  listTitle: string;
  titleField: string;
  urlField: string;
  iconField: string;
}

export interface IQuickLinksState {
  quickLinks: IQuickLink[];
}

class QuickLinks extends React.Component<IQuickLinksProps, IQuickLinksState> {
  constructor(props: IQuickLinksProps) {
    super(props);
    this.state = {
      quickLinks: []
    };
  }

  public async componentDidMount(): Promise<void> {
    console.log('componentDidMount called');
    await this.fetchListItems();
  }

  private async fetchListItems(): Promise<void> {
    //const { listTitle, titleField, urlField, iconField } = this.props;
    //const apiUrl = `${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listTitle}')/items?$select=${titleField},${urlField},${iconField}`;
    const apiUrl = `${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('QuickLinks')/items?$select=Title,URL,Icon`;
    try {
      const response: SPHttpClientResponse = await this.props.context.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1);
      const data = await response.json();
      console.log('Fetched data:', data);

      const quickLinks = data.value.map((item: any) => ({
        title: item['Title'],
        url: item['URL'],
        iconName: item['Icon']
      }));

      this.setState({ quickLinks });
    } catch (error) {
      console.error('Error fetching list items:', error);
    }
  }
//<div>{link.title}</div>
  public render(): React.ReactElement<IQuickLinksProps> {
    return (
      <div className={styles.quickLinks}>
        <div className={styles.grid}>
          {this.state.quickLinks.map((link, index) => (
            <div key={index} className={styles.gridItem}>
              <a href={link.url} title={link.title}>
              <Icon iconName={link.iconName} className={styles.icon} />
                
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default QuickLinks;

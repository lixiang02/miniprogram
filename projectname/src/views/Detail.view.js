import React from 'react';
import { Button } from 'antd';
import { DetailTable, Panel } from 'mcf-components';
import { ViewPage } from 'mcf-crud';

export default class DetailView extends ViewPage {
  componentDidMount() {
    const {
      actions,
      match: { params },
    } = this.props;

    actions.fetchItem({ id: params.id });
  }

  handleCancel(values) {
    this.goBack();
  }
  renderPanelFooter(){
    const { locale } = this.props;

    return (
      <Button
        type="primary"
        onClick={this.handleCancel.bind(this, 'handleCancel')}
      >
        {locale('GLOBAL.BACK')}
      </Button>
    )
  }
  render() {
    const { item, locale } = this.props;
    const basic = item.basic || {};
    const source = [
      {
        label: locale('name.label'),
        value: basic.name,
      },
      {
        label: locale('title.label'),
        value: basic.title,
      },
    ];

    return (
      <Panel
        title={locale('GLOBAL.DETAIL')}
        footer={this.renderPanelFooter}
      >
        <DetailTable
          title={locale('baseInfo.title')}
          dataSource={source}
          labelKey="label"
          columnNumber={2}
        />
      </Panel>
    );
  }
}

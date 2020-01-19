import React from 'react';
import { shallow } from 'enzyme';
import { Button} from 'antd';
import DetailView from '../views/Detail.view';

function setup(props, options) {
  const defaultProps = {
    item: {},
    match: {
      params: {},
    },
    actions: {
      fetchItem: jest.fn(),
    },
    locale: jest.fn().mockImplementation(name => name),
  };
  const wrapper = shallow(
    <DetailView {...Object.assign({}, defaultProps, props)} />,
    options
  );

  return {
    wrapper,
  };
}

describe('快照测试', () => {
  const props = {};
  it('详情页全页快照', () => {
    const { wrapper } = setup(props);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('方法测试全覆盖', () => {
  const props = {
    history: {
      goBack: jest.fn(),
    },
    location: {
      search: '123456',
    },
  };

  it('renderPanelFooter 方法测试', () => {
    const { wrapper } = setup(props);
    const instance = wrapper.instance();

    const pf = shallow(instance.renderPanelFooter())
    
    expect(pf.instance()).toBeInstanceOf(Button)
  })
  it('handleCancel 方法测试', () => {
    const { wrapper } = setup(props);
    const instance = wrapper.instance();
    const goBackSpy = jest.spyOn(instance, 'goBack');

    instance.handleCancel();

    expect(goBackSpy).toHaveBeenCalled();
  });
});

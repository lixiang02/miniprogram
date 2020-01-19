import React from 'react';
import { shallow } from 'enzyme';
import FormView from '../views/Form.view';

function setup(props, options) {
  const defaultProps = {
    item: {},
    actions: {
      fetchItem: jest.fn(),
      fetchSave: jest.fn(),
    },
    querys: jest.fn(),
    spins: jest.fn(),
    dicts: jest.fn(),
    locale: jest.fn().mockImplementation(name => name),
    match: {
      params: {},
    },
    history: {
      push: jest.fn(),
    },
  };
  const wrapper = shallow(
    <FormView {...Object.assign({}, defaultProps, props)} />,
    options
  );

  return {
    wrapper,
  };
}

describe('快照测试', () => {
  it('添加模式表单页全页快照', () => {
    const props = {
      item: {},
    };
    const { wrapper } = setup(props);

    expect(wrapper).toMatchSnapshot();
  });
  it('编辑模式表单页全页快照', () => {
    const props = {
      match: {
        params: {
          id: 1,
        },
        item: {},
      },
    };
    const { wrapper } = setup(props);

    expect(wrapper).toMatchSnapshot();
  });
});

describe('方法测试全覆盖', () => {
  const props = {
    item: {},
    actions: {
      fetchItem: jest.fn(),
      fetchSave: jest.fn(),
    },
    match: {
      params: {
        id: 1,
      },
    },
    history: {
      push: jest.fn(),
      goBack: jest.fn(),
    },
  };

  it('handleSubmit 方法测试', () => {
    const { wrapper } = setup(props);
    const instance = wrapper.instance();
    // const goBackSpy = jest.spyOn(instance, 'goBack')

    instance.handleSubmit();

    expect(props.actions.fetchSave).toHaveBeenCalled();
    // expect(goBackSpy).toHaveBeenCalled()
  });
  it('handleCancel 方法测试', () => {
    const { wrapper } = setup(props);
    const instance = wrapper.instance();
    const goBackSpy = jest.spyOn(instance, 'goBack');

    instance.handleCancel();

    expect(goBackSpy).toHaveBeenCalled();
  });
  it('编辑模式 branch 测试', () => {
    expect(props.actions.fetchItem).toHaveBeenCalled();
  });
});

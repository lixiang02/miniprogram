import React from 'react';
import { shallow } from 'enzyme';
import ListView from '../views/List.view';

function setup(props, options) {
  const defaultProps = {
    item: {},
    items: [],
    actions: {
      fetchPage: jest.fn(),
      fetchDelete: jest.fn(),
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
    reducer: {
      page: {},
    },
  };
  const wrapper = shallow(
    <ListView {...Object.assign({}, defaultProps, props)} />,
    options
  );
  return {
    wrapper,
  };
}

describe('快照测试', () => {
  const props = {
    items: [],
  };
  it('列表页全页快照', () => {
    const { wrapper } = setup(props);

    expect(wrapper).toMatchSnapshot();
  });
});

describe('方法测试全覆盖', () => {
  const props = {
    items: [],
    querys: jest.fn().mockReturnValue({ a: 1 }),
  };
  it('searchParams 方法测试', () => {
    const { wrapper } = setup(props, { disableLifecycleMethods: true });
    const params = { a: 1 };

    expect(wrapper.instance().searchParams()).toEqual(params);
  });
  it('renderOptionItem 方法测试', () => {
    const { wrapper } = setup(props, { disableLifecycleMethods: true });
    const item = {
      value: 'id',
      label: 'name',
    };

    expect(wrapper.instance().renderOptionItem(item).props.value).toBe(
      item.value
    );
    expect(wrapper.instance().renderOptionItem(item).props.children).toBe(
      item.label
    );
  });

  it('renderTableButtonGroups',()=>{
    const { wrapper } = setup(props, { disableLifecycleMethods: true });
    const tbgInstance = shallow(wrapper.instance().renderTableButtonGroups(null,{id:1}))
    expect(tbgInstance.find('Button[actionkey="edit"]').exists()).toEqual(true)
    expect(tbgInstance.find('Button[actionkey="detail"]').exists()).toEqual(true)
    expect(tbgInstance.find('Button[actionkey="delete"]').exists()).toEqual(true)
  })

  it('handlerMenu 测试ActionType undefined', () => {
    const { wrapper } = setup(props);
    const instance = wrapper.instance();
    const clearSelectRowsSpy = jest.spyOn(instance, 'clearSelectRows');

    instance.handlerMenu('', '');

    expect(clearSelectRowsSpy).toHaveBeenCalled();
  });

  it('handlerMenu 测试ActionType add', () => {
    const { wrapper } = setup(props);
    const instance = wrapper.instance();
    const goAddSpy = jest.spyOn(instance, 'goAdd');
    const clearSelectRowsSpy = jest.spyOn(instance, 'clearSelectRows');

    instance.handlerMenu('', 'add');

    expect(goAddSpy).toHaveBeenCalled();
    expect(clearSelectRowsSpy).toHaveBeenCalled();
  });

  it('handlerMenu 测试ActionType edit', () => {
    const { wrapper } = setup(props);
    const instance = wrapper.instance();
    const goEditSpy = jest.spyOn(instance, 'goEdit');
    const clearSelectRowsSpy = jest.spyOn(instance, 'clearSelectRows');

    instance.handlerMenu('', 'edit');

    expect(goEditSpy).toHaveBeenCalled();
    expect(clearSelectRowsSpy).toHaveBeenCalled();
  });

  it('handlerMenu 测试ActionType detail', () => {
    const { wrapper } = setup(props);
    const instance = wrapper.instance();
    const goDetailSpy = jest.spyOn(instance, 'goDetail');
    const clearSelectRowsSpy = jest.spyOn(instance, 'clearSelectRows');

    instance.handlerMenu('', 'detail');

    expect(goDetailSpy).toHaveBeenCalled();
    expect(clearSelectRowsSpy).toHaveBeenCalled();
  });

  it('handlerMenu 测试ActionType delete', () => {
    const { wrapper } = setup(props);
    const instance = wrapper.instance();
    const clearSelectRowsSpy = jest.spyOn(instance, 'clearSelectRows');

    instance.handlerMenu('', 'delete');

    expect(instance.props.actions.fetchDelete).toHaveBeenCalled();
    expect(clearSelectRowsSpy).toHaveBeenCalled();
  });
});

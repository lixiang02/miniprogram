import router from '../router';
import * as Containers from '../container';

describe('router 组件测试', () => {
  it('router list ',()=>{
    const expected = [{
      path:"/",
      exact:true,
      component:Containers.ListContainer
    }]
    expect(router({path:"/"})).toEqual(expect.arrayContaining(expected))
  })
})
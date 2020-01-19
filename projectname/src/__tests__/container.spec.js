import * as Container from '../container'

describe('container 组件测试', () => {

  xit('container mapStateToProps ',()=>{
    const state={
      appReducer:{},
      fetchingReducer:{},
      ORMReducer:{}
    }
    const props={
      intl:{},
      match:{
        params:{
          id:0
        }
      }
    }
    const {mapStateToProps} = Container
    mapStateToProps(state,props)
  })

  it('container mapDispatchToProps ',()=>{
    const dispatch=jest.fn()
    const props={
      intl:{},
      match:{
        params:{
          id:0
        }
      }
    }
    const {mapDispatchToProps} = Container
    expect(mapDispatchToProps(dispatch,props))
  })
})
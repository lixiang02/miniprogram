import * as Containers from './container';
function routes(props){
  const {path} = props
  return [{
    path:`${path}`,
    exact:true,
    component:Containers.ListContainer
  },{
    path:`${path}/add`,
    component:Containers.FormContainer
  },{
    path:`${path}/:id/edit`,
    component:Containers.FormContainer
  },{
    path:`${path}/:id`,
    component:Containers.DetailContainer
  }]
}
export default routes

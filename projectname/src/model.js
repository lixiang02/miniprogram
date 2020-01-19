import {ModuleModel} from 'mcf-module'

const {attr,BaseModel} = ModuleModel
export const namespace = "projectname"

export default class projectname extends BaseModel {
  static modelName = namespace
  static fields={}
  static options={
    // idAttribute: 'serverId',
  }
}


  // console.log(Schedule.fields)
Object.assign(projectname.fields,BaseModel.fields,{
    name:attr(),
    title:attr(),
})

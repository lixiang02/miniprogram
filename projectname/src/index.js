import {renderRoutes} from 'react-router-config'
import router from './router';
import saga from './saga';
import reducer from './reducer';
import * as model from './model';
import * as container from './container';

export { saga, reducer, router, model, container };
export default (props)=>renderRoutes(router(props.match));

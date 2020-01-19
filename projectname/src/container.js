import { injectIntl } from 'react-intl';
import { sagaActions } from './saga';
import FormView from './views/Form.view';
import ListView from './views/List.view';
import DetailView from './views/Detail.view';
import messages from './locales';
import { namespace } from './model';
import { ModuleContainer, ModuleModel } from 'mcf-module';

const { connect, bindActionCreators, defaultMergeProps } = ModuleContainer;
const { reducerItemSelector, reducerListSelector } = ModuleModel;

export const mapStateToProps = (state, props) => {
  return {
    intl: props.intl,
    appReducer: state.appReducer,
    fetchingReducer: state.fetchingReducer,
    reducer: state[namespace],
    messages: messages,
    items: reducerListSelector(state.ORMReducer, namespace),
    item: reducerItemSelector(
      state.ORMReducer,
      namespace,
      props.match.params.id
    ),
  };
};

export const mapDispatchToProps = (dispatch, props) => {
  return {
    actions: bindActionCreators(sagaActions, dispatch),
    dispatch,
  };
};

export const FormContainer = injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    defaultMergeProps
  )(FormView)
);
export const DetailContainer = injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    defaultMergeProps
  )(DetailView)
);
export const ListContainer = injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    defaultMergeProps
  )(ListView)
);

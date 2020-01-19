// import React from 'react';
// import { call, put } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
// import { ModuleSaga, ModuleMiddleware, ModuleRouter } from 'mcf-module';
import SagaRoot from '../saga';
// import { reducerActions } from '../reducer';
// import * as Api from '../api';

// const {showSuccess,showError} =ModuleMiddleware
// const { goBack } = ModuleRouter

describe('saga 单元测试', () => {
  it('saga 单元测试', done => {
    const gen = cloneableGenerator(SagaRoot)();

    gen.next();

    expect(gen.next().done).toBe(true);
    done();
  });
});

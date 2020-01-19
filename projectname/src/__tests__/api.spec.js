import * as api from '../api';

jest.autoMockOff();

describe('FetchUtils请求测试', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('api.fetchList', done => {
    let mockResult = {};
    fetch.mockResponse(JSON.stringify(mockResult));
    api.fetchList().then(result => {
      expect(fetch.mock.calls[0][0]).toEqual(`${API_PREFIX}/api_prefix`);
      expect(fetch.mock.calls[0][1].method).toEqual('GET');
      expect(result).toEqual(mockResult);
      done();
    });
  });

  it('api.fetchItem', done => {
    let params = {
      id: '1',
    };
    let mockResult = {};
    fetch.mockResponse(JSON.stringify(mockResult));
    api.fetchItem(params).then(result => {
      expect(fetch.mock.calls[0][0]).toEqual(`${API_PREFIX}/api_prefix/1?id=1`);
      expect(fetch.mock.calls[0][1].method).toEqual('GET');
      expect(result).toEqual(mockResult);
      done();
    });
  });

  it('api.fetchUpdate', done => {
    let params = {
      id: '1',
    };
    let mockResult = {};
    fetch.mockResponse(JSON.stringify(mockResult));
    api.fetchUpdate(params).then(result => {
      expect(fetch.mock.calls[0][0]).toEqual(`${API_PREFIX}/api_prefix/1`);
      expect(fetch.mock.calls[0][1].method).toEqual('POST');
      expect(result).toEqual(mockResult);
      done();
    });
  });
  it('api.fetchSave', done => {
    let params = {
      id: '1',
    };
    let mockResult = {};
    fetch.mockResponse(JSON.stringify(mockResult));
    api.fetchSave(params).then(result => {
      expect(fetch.mock.calls[0][0]).toEqual(`${API_PREFIX}/api_prefix/1`);
      expect(fetch.mock.calls[0][1].method).toEqual('POST');
      expect(result).toEqual(mockResult);
      done();
    });
  });

  it('api.fetchDelete', done => {
    let params = {
      id: [1],
      parentId: '1',
    };
    let mockResult = {};
    fetch.mockResponse(JSON.stringify(mockResult));
    api.fetchDelete(params).then(result => {
      expect(fetch.mock.calls[0][0]).toEqual(`${API_PREFIX}/api_prefix/1`);
      expect(fetch.mock.calls[0][1].method).toEqual('POST');
      expect(fetch.mock.calls[0][1].body).toEqual(JSON.stringify(params));
      expect(result).toEqual(mockResult);
      done();
    });
  });
});

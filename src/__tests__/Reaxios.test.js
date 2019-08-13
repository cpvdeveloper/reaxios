import React from 'react'
import { shallow } from 'enzyme'
import axiosMock from 'axios'
import Reaxios from '../Reaxios'

const mockGetSuccess = response => (
  axiosMock.get.mockResolvedValueOnce({ data: response })
)

const mockImplementation = (ms, response) => (
  axiosMock.get.mockImplementationOnce(() => setTimeout(Promise.resolve(response), ms))
)

describe('<Reaxios />', () => {
  let REQUEST_URL = 'http://localhost:3000'
  const RESPONSE = [ { 1: 'Test' }, { 1: 'Test again'} ]

  const ReaxiosToRender = (
    <Reaxios url={REQUEST_URL}>
      {({ response, isLoading, error }) => (
        <div response={response} isLoading={isLoading} error={error} />
      )}
    </Reaxios>
  )
  let wrapper

  beforeEach(() => {
    axiosMock.get.mockRestore()
    mockImplementation(3000)
    wrapper = shallow(ReaxiosToRender)
  })

  test('calls the makeRequest function in componentDidMount', () => {
    const makeRequestSpy = jest.spyOn(Reaxios.prototype, 'makeRequest')
    wrapper.instance().componentDidMount()
    expect(makeRequestSpy).toHaveBeenCalledTimes(1)
  })

  test('passes the state as props to the child', () => {
    expect(wrapper.find('div').props()).toEqual(wrapper.instance().state)
  })

  test('initial state', () => {
    axiosMock.get.mockRestore()
    mockImplementation(3000)
    wrapper = shallow(ReaxiosToRender)
    expect(wrapper.instance().state).toEqual({
      response: null,
      isLoading: true,
      error: null,
    })
  })

  describe('the makeRequest method', () => {
    beforeEach(() => {
      axiosMock.get.mockRestore()
      mockGetSuccess(RESPONSE)
      wrapper = shallow(ReaxiosToRender)
    })
    
    test('makes an axios request to provided URL', () => {
      expect(axiosMock.get).toHaveBeenCalledWith(REQUEST_URL)
    })

    describe('when the request is successful', () => {
      test('sets component state', () => {
        expect(wrapper.instance().state).toEqual({
          response: RESPONSE,
          isLoading: false,
          error: null,
        })
      })
    })

    describe('when the request fails', () => {
      const ERROR = new Error('Test error')

      beforeEach(() => {
        axiosMock.get.mockRestore()
        axiosMock.get.mockRejectedValueOnce(ERROR)
        wrapper = shallow(ReaxiosToRender)
      })

      test('sets component state', () => {
        expect(wrapper.instance().state).toEqual({
          response: null,
          isLoading: false,
          error: ERROR,
        })
      })
    })
  })
})

# reaxios

## Basic usage as a component
A request to the provided URL will be made once the Reaxios component is mounted, and it's child should be a function which will receive arguments describing the request - `response, isLoading, error`.    
```javascript
<Reaxios url='https://localhost:3000/endpoint'>
  {
    ({ response, isLoading, error }) => {
    
      // Some logic here if necessary e.g. format the response data
      
      return (
        <MyComponent
          data={response}
          isLoading={isLoading}
          error={error}
        />
      )
  }
</Reaxios>
```

## useReaxios hook
```js
function ComponentUsingReaxios() {

  const { response, isLoading, error } = useReaxios('http://localhost:5000/shops');

  return (
    <MyComponent
      isLoading={isLoading}
      options={response}
      error={error}
    />
  );
}
```
`useReaxios` takes additional, optional arguments: a second argument which is a function to format/modify the `response` data, and further arguments which will be used as arguments to this format function (the format function will always receive the response data itself as a first argument).    
```js
const format = {
    fn: (responseData, attribute) => responseData.map(item => item[attribute]),
    args: ['name'],
};

const { response, isLoading, error } = useReaxios('/endpoint', format.fn, ...format.args);
```
alternatively, provide just the `format` object as a second argument
```js
const { response, isLoading, error } = useReaxios('/endpoint', format);
``` 

## withReaxios HOC usage
Enhance a component with Reaxios. The wrapped component will recieve `response, isLoading, error` props.
```js
const EnhancedComponent = withReaxios('http://localhost:3000/endpoint')(ComponentToEnhance);
```
`withReaxios` also accepts further arguments which can be used to modify/format the response, as described above.
## Reaxios as a basis for custom HOCs
It's easy to create reusable, custom higher-order component from Reaxios - for example one that extends the functionality of the built-in `withReaxios` described above.   

Take for example, a SelectDropdown component which is populated by the response to some async fetch. You may have many SelectDropdown components, all behaving exactly the same, but being populated by different data. It might be useful to create a HOC that tailors the Reaxios component to fit this SelectDropdown by:
1. Formatting the response data
2. Renaming the props
3. Converting the error into a boolean value 
4. Using a base URL such that only a path must be provided

```javascript
export const withReaxiosSelect = path => BaseSelectComponent => props => {
  const baseUrl = 'http:localhost:3000';
  const fullUrl = `${baseUrl}/${path}`;

  const formatFn = {
    fn: (responseData, label, value) => responseData.map(item => ({
      label: item[label],
      value: item[value],
    })),
    args: ['name', '_id']
  };

  return (
    <Reaxios url={fullUrl}>
      {
        ({ response, isLoading, error }) => {
        
          const dataLoadingProps = {
            response: response ? formatFn.fn(response, ...formatFn.args) : null,
            loading: isLoading,
            error: !!error,
          };
          
          return <BaseSelectComponent {...dataLoadingProps} {...props} />
        }
      }
    </Reaxios>
  )
}
``` 
```js
export default withReaxiosSelect('endpoint-only')(SelectDropdown);
```
                     

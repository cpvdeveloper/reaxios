# reaxios

## Basic usage
```javascript
<Reaxios url='https://localhost:3000/endpoint'>
  {
    ({ response, isLoading, error }) => {
      // Some logic here if necessary 
      <MyComponent
        data={response}
        isLoading={isLoading}
        error={error}
      />
  }
</Reaxios>
```

## withReaxios HOC usage
Enhance a component with Reaxios:
```javascript
const EnhancedComponent = withReaxios('http://localhost:3000/endpoint')(ComponentToEnhance);
```
## Custom withReaxios HOC
`dataLoadingProps` are mapped before being passed to the `BaseComponent`. 

Take for example, a simple SelectDropdown component which is populated by the response to some async network request, and takes the following props for this:
- `options`, a list of items to be shown in the Select dropdown, in a specific format (array of objects with value and label keys)
- `loading`, a boolean to show if the request to get the options is loading
- `error`, a boolean to show if there has been an error with the request to get options

You may have many SelectDropdown components like this, all populated by different data/requests. A SelectDropdown-specific HOC is shown below, which can be used for each SelectDropdown given the correct URL and data format arguments (value and label).  
```javascript
export const withReaxiosSelect = (url, value, label) => BaseSelectComponent => {
  return (
    function(props) {
      return (
        <Reaxios url={url}>
          {
            ({ response, isLoading, error }) => {
              const dataLoadingProps = {
                response: response ? formatData(response, value, label) : undefined,
                loading: isLoading,
                error: !!error,
              };
              return <BaseSelectComponent {...dataLoadingProps} {...props} />
            }
          }
        </Reaxios>
      )
    }
  )
}

// Formats the response data for the SelectDropdown component
function formatData(rawData, value, label) {
  return rawData.map(item => ({
    value: item[value],
    label: item[label],
  }))
}
```

```javascript
<SelectDropdown
  placeholder={placeholder}
  value={value}
  onChange={onChange}
  multiple={multiple}
  options={options}
  loading={loading}
  error={error}
/>

// Now given options, loading and error props
export default withReaxiosSelect('http://localhost:3000/endpoint', '_id', 'name')(SelectDropdown);
```
                     

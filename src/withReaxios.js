import { React, Component } from 'react';

const withReaxios = url => BaseComponent => {
    return (
        function WithReaxios(props) {
            return (
                <Reaxios url={url}>
                    {
                        ({ response, isLoading, error }) => {

                            const dataLoadingProps = {
                                response,
                                isLoading,
                                error,
                            };

                            return <WrappedComponent {...dataLoadingProps} {...props} />
                        }
                    }
                </Reaxios>
            )
        }
    )
}

export default withReaxios;
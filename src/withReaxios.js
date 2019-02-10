import { React, Component } from 'react';

const withReaxios = url => BaseComponent => props => (
    <Reaxios url={url}>
        {
            ({ response, isLoading, error }) => {

                const dataLoadingProps = {
                    response,
                    isLoading,
                    error,
                };

                return <BaseComponent {...dataLoadingProps} {...props} />
            }
        }
    </Reaxios>
)

export default withReaxios;
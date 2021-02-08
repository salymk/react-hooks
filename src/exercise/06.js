// useEffect: HTTP requests
// 💯 handle errors
// http://localhost:3000/isolated/final/06.extra-1.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'


function ErrorFallback({error}) {
  return (
    <div role="alert">
    There was an error:{' '}
    <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
  </div>
  )
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({pokemon: null, error: null, status: 'idle'})
  const {status, pokemon, error} = state
  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    setState({status: 'pending'})
    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({status: 'resolved', pokemon})
      },
      error => {
        // setError(error)
        // setStatus('rejected')
        setState({status: 'rejected', error})
      },
    )
  }, [pokemonName])

  if(status === 'idle') {
    return 'Submit a pokemon'
  } else if(status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if(state.status === 'rejected') {
    throw error
  } else if(state.status ==='resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }
  throw new Error('This should be impossible')

}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary 
         resetKeys={pokemonName} FallbackComponent={ErrorFallback}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
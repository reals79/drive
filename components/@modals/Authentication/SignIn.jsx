import React from 'react'
import PropTypes from 'prop-types'
import { Button, Input } from '@components'

const SignIn = ({ data, onChange, onSelect, onSubmit, onReset }) => {
  return (
    <div className="p-4 px-5 mx-5">
      <Input
        className="d-flex-1"
        title="Email"
        value={data['email']}
        placeholder="Type here..."
        direction="vertical"
        onChange={onChange('email')}
      />
      <Input
        type="password"
        className="d-flex-1 mt-3"
        title="Password"
        value={data['password']}
        placeholder="Type here..."
        direction="vertical"
        onChange={onChange('password')}
      />
      <Button className="mt-4 mx-auto" name="LOGIN" onClick={onSubmit} />
      <div className="d-flex justify-content-center mt-4">
        <span className="dsl-m12">Don't have account?</span>
        <span className="dsl-p12 ml-2 text-500 cursor-pointer" onClick={() => onSelect('signup')}>
          Create one
        </span>
      </div>
      <p className="dsl-p12 text-center text-500 cursor-pointer mt-3 mb-0" onClick={() => onReset()}>
        Forgot your password
      </p>
    </div>
  )
}

export default SignIn

import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { Input, Button } from '~/components'
import AppActions from '~/actions/app'
import CommunityActions from '~/actions/community'
import './AccountAdmin.scss'

const Password = props => {
  const dispatch = useDispatch()

  const user = useSelector(state => state.app.user)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleResetPassword = () => {
    dispatch(AppActions.modalRequest({ type: 'Reset Password' }))
  }

  const handleDiscard = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleSave = () => {
    if (currentPassword === '' && newPassword === '' && confirmPassword === '') return null
    else {
      if (newPassword !== confirmPassword) {
        toast.error('New Password and Re-enter Password does not match', {
          position: toast.POSITION.TOP_RIGHT,
        })
      } else {
        const regExp = /^(?=.*[A-Za-z])(?=.*[@$!%*#?&])[A-Za-z\d@$!-)(><%*#?&]{8,}$/g
        if (regExp.test(newPassword)) {
          const payload = {
            userId: user.id,
            verfiyPassword: {
              email: user.email,
              user_id: user.id,
              password: currentPassword,
            },
            changePassword: {
              user: {
                id: user.id,
                password: newPassword,
              },
            },
          }
          dispatch(CommunityActions.postpasswordchangeRequest(payload))
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
        } else {
          toast.error(
            'Oops, Your New Password Must contain at least 8 symbols with one capital and one of the symbol: !, ?, <, >, /, %, $, #, @, ^, &, (, ), -, =   ',
            {
              position: toast.POSITION.TOP_RIGHT,
            }
          )
        }
      }
    }
  }

  return (
    <div className="card-bottom">
      <p className="dsl-b18 bold">Change Password</p>
      <div className="password">
        <Input
          title="Current Password"
          placeholder="Type here..."
          value={currentPassword}
          onChange={setCurrentPassword}
        />
        <div className="mt-3 password-text">
          <div className="my-2 border-bottom">
            <p className="dsl-d12 text-400">
              Forget your password? <Button size="small" type="link" name="Click here" onClick={handleResetPassword} />
            </p>
          </div>

          <p className="dsl-d12 text-400 my-5">
            {
              'Please enter a new password twice. Password should be more than 8 symbols, have one capital letter and one of the symbol: !, ?, <, >, /, %, $, #, @, ^, &, (, ), -, ='
            }
          </p>
        </div>

        <Input title="New Password" placeholder="Type here..." value={newPassword} onChange={setNewPassword} />
        <Input
          className="mt-4"
          title="Re-enter Password"
          placeholder="Type here..."
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
        <div className="d-flex justify-content-end mt-4">
          <Button type="link" className="mr-3" name="DISCARD" onClick={handleDiscard} />
          <Button name="SAVE" onClick={handleSave} />
        </div>
      </div>
    </div>
  )
}

export default Password

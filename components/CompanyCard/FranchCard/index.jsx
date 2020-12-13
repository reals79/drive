import React, { memo } from 'react'
import { Button, CheckBox, Icon } from '@components'
import './FranchCard.scss'

const FRANCHISES = [
  { id: 'acura', label: 'Acura' },
  { id: 'alfa romeo', label: 'Alfa Romeo' },
  { id: 'audi', label: 'Audi' },
  { id: 'bmw', label: 'BMW' },
  { id: 'buick', label: 'Buick' },
  { id: 'candillac', label: 'Candillac' },
  { id: 'chevrolet', label: 'Chevrolet' },
  { id: 'chrysler', label: 'Chrysler' },
  { id: 'dodge', label: 'Dodge' },
  { id: 'fiat', label: 'FIAT' },
  { id: 'ford', label: 'Ford' },
  { id: 'genesys', label: 'Genesys' },
  { id: 'gmc', label: 'GMC' },
  { id: 'honda', label: 'Honda' },
  { id: 'hyundai', label: 'Hyundai' },
  { id: 'infiniti', label: 'Infiniti' },
  { id: 'jaguar', label: 'Jaguar' },
  { id: 'jeep', label: 'Jeep' },
  { id: 'kia', label: 'KIA' },
  { id: 'land rover', label: 'Land Rover' },
  { id: 'lexus', label: 'Lexus' },
  { id: 'lincoln', label: 'Lincoln' },
  { id: 'mazerati', label: 'Mazerati' },
  { id: 'mazda', label: 'Mazda' },
  { id: 'mercedes-benz', label: 'Mercedes-Benz' },
  { id: 'mini', label: 'MINI' },
  { id: 'mitsubishi', label: 'Mitsubishi' },
  { id: 'nissan', label: 'Nissan' },
  { id: 'porsche', label: 'Porsche' },
  { id: 'smart', label: 'Smart' },
  { id: 'subaru', label: 'Subaru' },
  { id: 'toyota', label: 'Toyota' },
  { id: 'volkswagen', label: 'Volkswagen' },
  { id: 'volvo', label: 'Volvo' },
]

const FranchCard = ({ franchises, onChecked }) => {
  const handleFranchises = franchisee => evt => {
    const checked = evt.target.checked
    onChecked(franchisee, checked)
  }

  return (
    <div className="card mb-3 vdra-franchises">
      <p className="dsl-b22 bold">Franchises</p>
      <div className="d-flex flex-wrap">
        {FRANCHISES.map((franchisee, idx) => (
          <div className="vdra-w ml-3" key={`fc${idx}`}>
            <CheckBox
              className="dsl-b14 py-2"
              id={franchisee.id}
              key={franchisee.id}
              title={franchisee.label}
              checked={franchises.includes(franchisee.label)}
              onChange={handleFranchises(franchisee)}
              size="small"
            />
          </div>
        ))}
      </div>
      <div className="d-flex align-items-center">
        <Button className="ml-auto" type="low" size="small">
          <Icon name="fal fa-plus mr-2" size={10} color="#376caf" />
          ADD FRANCHISE
        </Button>
      </div>
    </div>
  )
}

export default memo(FranchCard)

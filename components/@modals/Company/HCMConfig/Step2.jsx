import React, { useState } from 'react'
import { useImmer } from 'use-immer'
import { Button, DynamicFormArray, Icon, Toggle } from '@components'

const defaultFormState = {
  departments: {
    depts: ['', '', ''],
  },
  teams: {
    isTeamInDept: false,
    accounting: ['', ''],
    bdc: [],
    finance: [],
    part: [],
    salesDpt: [],
    service: [],
  },
  roles: {
    accounting: ['', ''],
    bdc: [],
    finance: [],
    part: [],
    salesDpt: [],
    service: [],
  },
}

const Step2 = ({ onNext }) => {
  const [completion, setCompletion] = useState(0)
  const [formValues, updateFormValues] = useImmer(defaultFormState)
  const handlePlusClick = (section, field) => () => {
    const fieldLen = formValues[section][field].length
    updateFormValues(draft => {
      draft[section][field][fieldLen] = ''
    })
  }

  const handeInputChange = (section, field) => (idx, value) => {
    updateFormValues(draft => {
      draft[section][field][idx] = value
    })
  }

  const handleSave = () => {
    if (completion === 2) return onNext(3)
    setCompletion(completion + 1)
  }

  const handleToggle = checked => {
    updateFormValues(draft => {
      draft.teams.isTeamInDept = checked
    })
  }

  const handlePrev = () => {
    if (completion === 0) return onNext(1)
    setCompletion(completion - 1)
  }

  return (
    <div className="dept-team-role">
      {completion >= 0 && (
        <div className="section py-3">
          <div className="section-header">
            <p className="dsl-b16 bold">1. Define Departments</p>
            <p className="dsl-d14 description">
              List all the departments within your company. This can be changed later.
            </p>
          </div>

          <DynamicFormArray
            className="py-3"
            title="Departments"
            values={formValues.departments.depts}
            itemTitle="Department"
            onPlusClick={handlePlusClick('departments', 'depts')}
            onInputChange={handeInputChange('departments', 'depts')}
          />
        </div>
      )}

      {completion > 0 && (
        <div className="section py-3">
          <div className="section-header mb-3">
            <p className="dsl-b16 bold">2. Create Teams</p>
            <p className="dsl-d14 description">
              Are your departments organized into smaller teams? For example: some Sales Departments have Team A report
              to Sales Manager A, and Team B - to Sales Manager B
            </p>
          </div>

          <Toggle
            title="Team within departments?"
            leftLabel="Yes"
            rightLabel="No"
            checked={formValues.teams.isTeamInDept}
            onChange={handleToggle}
          />
          <DynamicFormArray
            className="py-3"
            title="Accounting / Administration"
            values={formValues.teams.accounting}
            itemTitle="Team"
            onPlusClick={handlePlusClick('teams', 'accounting')}
            onInputChange={handeInputChange('teams', 'accounting')}
          />

          <DynamicFormArray
            className="py-3"
            title="BDC"
            values={formValues.teams.bdc}
            itemTitle="BDC"
            onPlusClick={handlePlusClick('teams', 'bdc')}
            onInputChange={handeInputChange('teams', 'bdc')}
          />

          <DynamicFormArray
            className="py-3"
            title="Finance"
            values={formValues.teams.finance}
            itemTitle="Finance"
            onPlusClick={handlePlusClick('teams', 'finance')}
            onInputChange={handeInputChange('teams', 'finance')}
          />

          <DynamicFormArray
            className="py-3"
            title="Parts"
            values={formValues.teams.part}
            itemTitle="Part"
            onPlusClick={handlePlusClick('teams', 'part')}
            onInputChange={handeInputChange('teams', 'part')}
          />

          <DynamicFormArray
            className="py-3"
            title="Sales Department"
            values={formValues.teams.salesDpt}
            itemTitle="Department"
            onPlusClick={handlePlusClick('teams', 'salesDpt')}
            onInputChange={handeInputChange('teams', 'salesDpt')}
          />

          <DynamicFormArray
            className="py-3"
            title="Service"
            values={formValues.teams.service}
            itemTitle="Service"
            onPlusClick={handlePlusClick('teams', 'service')}
            onInputChange={handeInputChange('teams', 'service')}
          />
        </div>
      )}

      {completion > 1 && (
        <div className="section py-3">
          <div className="section-header">
            <p className="dsl-b16 bold">3. Add Roles to Departments</p>
            <p className="dsl-d12 description">
              Please tell us what Job Roles exist in each department, we've provided some suggestions below. Add as many
              as you can now. You can always add and edit more later.
            </p>
          </div>

          <DynamicFormArray
            className="py-3"
            title="Accounting / Administration"
            values={formValues.roles.accounting}
            itemTitle="Role"
            onPlusClick={handlePlusClick('roles', 'accounting')}
            onInputChange={handeInputChange('roles', 'accounting')}
          />

          <DynamicFormArray
            className="py-3"
            title="BDC"
            values={formValues.roles.bdc}
            itemTitle="Role"
            onPlusClick={handlePlusClick('roles', 'bdc')}
            onInputChange={handeInputChange('roles', 'bdc')}
          />

          <DynamicFormArray
            className="py-3"
            title="Finance"
            values={formValues.roles.finance}
            itemTitle="Role"
            onPlusClick={handlePlusClick('roles', 'finance')}
            onInputChange={handeInputChange('roles', 'finance')}
          />

          <DynamicFormArray
            className="py-3"
            title="Parts"
            values={formValues.roles.part}
            itemTitle="Role"
            onPlusClick={handlePlusClick('roles', 'part')}
            onInputChange={handeInputChange('roles', 'part')}
          />

          <DynamicFormArray
            className="py-3"
            title="Sales Department"
            values={formValues.roles.salesDpt}
            itemTitle="Role"
            onPlusClick={handlePlusClick('roles', 'salesDpt')}
            onInputChange={handeInputChange('roles', 'salesDpt')}
          />

          <DynamicFormArray
            className="py-3"
            title="Service"
            values={formValues.roles.service}
            itemTitle="Role"
            onPlusClick={handlePlusClick('roles', 'service')}
            onInputChange={handeInputChange('roles', 'service')}
          />
        </div>
      )}
      <div className="d-flex mt-3 justify-content-end">
        <Button className="ml-auto mr-2" type="low" size="small" onClick={handlePrev}>
          <Icon name="fal fa-arrow-left mr-2" size={10} color="#376caf" />
          Previous
        </Button>
        <Button name="SAVE" onClick={handleSave} />
      </div>
    </div>
  )
}

export default Step2

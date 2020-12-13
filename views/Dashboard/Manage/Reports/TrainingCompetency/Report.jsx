import React from 'react'
import { Button, TaskEmptyList } from '@components'
import ReportItem from './ReportItem'
import './TrainingCompetency.scss'

class Report extends React.PureComponent {
  state = {
    showProcess: 5,
    showSkills: 5,
    showProductKnowledge: 5,
    showTemperment: 5,
  }
  render() {
    const { showProcess, showSkills, showProductKnowledge, showTemperment } = this.state
    const { process, skills, productKnowledge, temperment } = this.props
    return (
      <div className="mx-0 training-competency-report">
        <div className="px-3 pb-2">
          <div className="align-items-center my-md-4 my-3">
            <span className="dsl-b22 bold">Process </span>
            <span className="dsl-l11 mb-0">{process.length}</span>
          </div>
          {process && <ReportItem data={process} per={showProcess} />}
          {process.length === 0 && <TaskEmptyList type="blank" message="There is no assigned training to show" />}
          {process.length !== 0 && process.length > showProcess && (
            <div className="d-h-end py-2">
              <Button type="medium" name="SEE MORE" onClick={() => this.setState({ showProcess: process.length })} />
            </div>
          )}
          {process.length !== 0 && showProcess > 5 && (
            <div className="d-h-end py-2">
              <Button type="medium" name="SEE LESS" onClick={() => this.setState({ showProcess: 5 })} />
            </div>
          )}
        </div>
        <div className="px-3 pb-2">
          <div className="align-items-center my-md-4 my-3">
            <span className="dsl-b22 bold">Skill </span>
            <span className="dsl-l11 mb-0">{skills.length}</span>
          </div>
          {skills && <ReportItem data={skills} per={showSkills} />}
          {skills.length === 0 && <TaskEmptyList type="blank" message="There is no assigned training to show" />}
          {skills.length !== 0 && skills.length > showSkills && (
            <div className="d-h-end py-2">
              <Button type="medium" name="SEE MORE" onClick={() => this.setState({ showSkills: skills.length })} />
            </div>
          )}
          {skills.length !== 0 && showSkills > 5 && (
            <div className="d-h-end py-2">
              <Button type="medium" name="SEE LESS" onClick={() => this.setState({ showSkills: 5 })} />
            </div>
          )}
        </div>
        <div className="px-3 pb-2">
          <div className="align-items-center my-md-4 my-3">
            <span className="dsl-b22 bold">Product Knowledge </span>
            <span className="dsl-l11 mb-0">{productKnowledge.length}</span>
          </div>
          {productKnowledge && <ReportItem data={productKnowledge} per={showProductKnowledge} />}
          {productKnowledge.length === 0 && (
            <TaskEmptyList type="blank" message="There is no assigned training to show" />
          )}
          {productKnowledge.length !== 0 && productKnowledge.length > showProductKnowledge && (
            <div className="d-h-end py-2">
              <Button
                type="medium"
                name="SEE MORE"
                onClick={() => this.setState({ showProductKnowledge: productKnowledge.length })}
              />
            </div>
          )}
          {productKnowledge.length !== 0 && showProductKnowledge > 5 && (
            <div className="d-h-end py-2">
              <Button type="medium" name="SEE LESS" onClick={() => this.setState({ showProductKnowledge: 5 })} />
            </div>
          )}
        </div>
        <div className="px-3 pb-2">
          <div className="align-items-center my-md-4 my-3">
            <span className="dsl-b22 bold">Temperment </span>
            <span className="dsl-l11 mb-0">{temperment.length}</span>
          </div>
          {temperment && <ReportItem data={temperment} per={showTemperment} />}
          {temperment.length === 0 && <TaskEmptyList type="blank" message="There is no assigned training to show" />}
          {temperment.length !== 0 && temperment.length > showTemperment && (
            <div className="d-h-end py-2">
              <Button
                type="medium"
                name="SEE MORE"
                onClick={() => this.setState({ showTemperment: temperment.length })}
              />
            </div>
          )}
          {temperment.length !== 0 && showTemperment > 5 && (
            <div className="d-h-end py-2">
              <Button type="medium" name="SEE LESS" onClick={() => this.setState({ showTemperment: 5 })} />
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default Report

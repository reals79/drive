import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Col, Button } from 'react-bootstrap'
import { contains, filter, isNil } from 'ramda'
import { Icon } from '@components'
import DevActions from '~/actions/develop'
import { loading } from '~/services/util'
import './LearnChildQuiz.scss'

class LearnChildQuiz extends Component {
  state = {
    inputValue: '',
    optionValues: [],
    submitted: false,
  }

  componentDidMount() {
    if (!this.props.isBusy) {
      this.props.getQuestion(this.props.quizId)
    }
  }

  handleQuestions = () => {
    this.setState({ submitted: false })
  }

  handleSubmit = () => {
    const { quizQuestion, quizId } = this.props
    const { inputValue, optionValues } = this.state
    if (optionValues?.length === 0 && inputValue === '') {
      alert('please select any answer!')
      return
    }

    if (quizQuestion.type === 3 || quizQuestion.type === 4) {
      const payload = { answered: optionValues }
      this.props.submitAnswer(quizId, payload)
    } else {
      const payload = { answered: [inputValue] }
      this.props.submitAnswer(quizId, payload)
    }
    this.setState({ inputValue: '', optionValues: [], submitted: true })
  }

  handleChangeInput = evt => {
    const target = evt.target
    this.setState({ inputValue: target.value })
  }

  handleChangeItems = (ind, type) => {
    const { optionValues } = this.state
    if (type === 3) {
      let value = []
      value.push(ind + 1)
      this.setState({ optionValues: value })
    } else {
      if (contains(ind + 1, optionValues)) {
        const values = filter(item => item !== ind + 1, optionValues)
        this.setState({ optionValues: values })
      } else {
        optionValues.push(ind + 1)
        this.setState({ optionValues })
      }
    }
  }

  render() {
    const { inputValue, optionValues, submitted } = this.state
    const { quizQuestion, answers, name, onFinish, isBusy } = this.props
    const { num, title, type, options, completed, result, message } = quizQuestion

    return (
      <div className="learn-child-quiz p-3">
        {completed && !isBusy ? (
          <>
            {answers.correct === 0 && !answers.error && submitted ? (
              <div className="text-center">
                <p className="my-2">Your answer is incorrect!</p>
                <p className="my-2">{`The correct answer is ${answers.answer}.`}</p>
                <Button className="btn-next my-2 bg-primary" onClick={this.handleQuestions}>
                  Next
                </Button>
              </div>
            ) : (
              <div className="align-items-center justify-content-center">
                <div className="flex-column align-items-center">
                  {!isNil(result) && result.passed === 1 ? (
                    <div className="text-center">
                      <p className="dsl-p16 my-2">Congratulations!</p>
                      <p className="dsl-b14 my-2">{`You passed with ${!isNil(result) && result.correct}/${!isNil(
                        result
                      ) && result.taken} correct.`}</p>
                    </div>
                  ) : (
                    <p className="dsl-b14 my-2">{message}</p>
                  )}
                  <div className="text-center">
                    <Button
                      className="btn-next my-2 bg-primary"
                      onClick={() => (isNil(result) ? onFinish(0) : onFinish(result.passed))}
                    >
                      Finish
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="dsl-p16">{name}</p>
            {answers.correct === 0 && !answers.error && submitted ? (
              <div className="text-center">
                <p className="my-2">Your answer is incorrect!</p>
                <p className="my-2">{`The correct answer is ${answers.answer}.`}</p>
                <Button className="btn-next my-2 bg-primary" onClick={this.handleQuestions}>
                  Next
                </Button>
              </div>
            ) : (
              <div>
                <p>{`${num}. ${title}`}</p>
                {(type === 1 || type === 2) && (
                  <div className="my-2">
                    <input value={inputValue} placeholder="input your answer" onChange={this.handleChangeInput} />
                  </div>
                )}
                {(type === 3 || type === 4) && (
                  <Row className="mx-0">
                    {options.map((option, index) => (
                      <Col
                        key={`option${index}`}
                        xs={12}
                        sm={6}
                        className="d-flex p-0 mb-2 cursor-pointer"
                        onClick={() => this.handleChangeItems(index, type)}
                      >
                        <div className="radio-item">
                          <Icon name="fal fa-circle" color="#343f4b" size={19} />
                          {contains(index + 1, optionValues) && <Icon name="fas fa-circle" color="#343f4b" size={11} />}
                        </div>
                        &nbsp;&nbsp;
                        {option}
                      </Col>
                    ))}
                  </Row>
                )}
                {type === 5 && (
                  <div className="my-2">
                    <textarea value={inputValue} placeholder="input your answer" onChange={this.handleChangeInput} />
                  </div>
                )}
                <div className="text-right">
                  <Button className="btn-next bg-primary mt-2 mb-2" onClick={this.handleSubmit}>
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isBusy: loading(state.develop.status, 'pending-drq'),
  quizQuestion: state.develop.learnQuizQuestions,
  answers: state.develop.learnQuizAnswers,
})

const mapDispatchToProps = dispatch => ({
  getQuestion: id => dispatch(DevActions.questionRequest(id)),
  submitAnswer: (id, payload) => dispatch(DevActions.answerRequest(id, payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LearnChildQuiz)

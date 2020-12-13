import React, { memo } from 'react'
import { includes } from 'ramda'
import { Button, CheckBox, Dropdown, Icon, Input } from '@components'
import { QuizType } from '~/services/config'

function Question(props) {
  const {
    index = 1,
    question,
    onRemoveQuestion,
    onAddAnswer,
    onChangeType,
    onChangeQuestion,
    onChangeAnswer,
    onChecked,
    dataCy,
  } = props

  const { type, rules, wording } = question
  return (
    <div className="border-bottom mt-4" data-cy={dataCy}>
      <div className="d-h-between mb-3">
        <div className="d-h-start">
          <div className="question-circle">{index}</div>
          <span className="dsl-b18 bold">Question</span>
        </div>
        <Button type="link" onClick={() => onRemoveQuestion(index - 1)}>
          <Icon name="far fa-trash-alt" size={14} color="#376caf" />
        </Button>
      </div>
      <Dropdown
        className="ml-4 mb-3"
        title="Type"
        direction="vertical"
        width="fit-content"
        dataCy="quizType"
        data={QuizType}
        defaultIds={[type]}
        getValue={e => e.label}
        onChange={e => onChangeType(e, index - 1)}
      />
      <div>
        <Input
          className="module-input ml-4 mb-3"
          title="Question"
          placeholder="Type here..."
          dataCy="questionTitle"
          value={wording}
          direction="vertical"
          onChange={e => onChangeQuestion(e, index - 1)}
        />
      </div>
      {type === 3 || type === 4 ? (
        <div className="mb-3" data-cy="isItCorrect">
          {rules.options.map((item, idx) => (
            <div key={idx} className="d-flex">
              <div className="d-flex-1 px-4">
                {idx === 0 && <p className="dsl-m12">Is it correct?</p>}
                <CheckBox
                  className="mb-1"
                  dataCy={`correctType${index}${idx}`}
                  size="tiny"
                  id={`quiz-${index}-${idx}`}
                  checked={type === 3 ? Number(rules?.answer) == idx + 1 : includes(`${idx + 1}`, rules?.answer)}
                  title="Correct"
                  onChange={e => onChecked(e.target.checked, index - 1, idx + 1)}
                />
              </div>
              <Input
                className={`module-input d-flex-5 ${idx === 0 ? 'mb-1' : 'mt-1'}`}
                title={idx === 0 ? 'Answers' : null}
                placeholder={`${idx + 1}. Type here...`}
                value={item}
                direction="vertical"
                dataCy={`answer${idx}${index}`}
                onChange={e => onChangeAnswer(e, index - 1, idx)}
              />
            </div>
          ))}
          <div className="d-flex px-4 mt-1">
            <div className="d-flex-1" />
            <div className="d-flex-5 pl-3">
              <Button dataCy="addAnswerBtn" type="link" onClick={() => onAddAnswer(index)}>
                <Icon name="far fa-plus" size={14} color="#376caf" />
                <span className="dsl-p14 text-400 ml-1">Add Answer</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Input
          className="module-input ml-4 mb-3"
          title="Answers"
          placeholder="Type here..."
          dataCy="answer"
          type={type === 2 ? 'number' : 'text'}
          rows={type === 5 ? 3 : 1}
          value={rules?.answer}
          direction="vertical"
          onChange={e => onChangeAnswer(e, index - 1, 0)}
        />
      )}
    </div>
  )
}

export default memo(Question)

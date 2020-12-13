import React from 'react'
import PropTypes from 'prop-types'
import { LibraryProgramsList as ProgramsList } from '@components'
import './LibraryProgramsCareer.scss'

class List extends React.PureComponent {
  handleToggle = e => () => {
    this.props.onToggle(e)
  }

  render() {
    const { data, role } = this.props

    return (
      <>
        {data.map((item, index) => (
          <ProgramsList.ClosedList
            key={`${item.id}-${index}`}
            role={role}
            name={item.title}
            modules={item.data.assigned}
            description={item.data.description}
            type="careers"
            published={item.published}
            onToggle={this.handleToggle(item.id)}
            onChange={e => this.props.onChange(e, item)}
          />
        ))}
      </>
    )
  }
}

List.propTypes = {
  role: PropTypes.number,
  data: PropTypes.array,
  onToggle: PropTypes.func,
  onModal: PropTypes.func,
}

List.defaultProps = {
  role: 1,
  data: [],
  onToggle: () => {},
  onModal: () => {},
}

export default List

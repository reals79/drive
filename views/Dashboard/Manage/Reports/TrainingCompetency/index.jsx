import React from 'react'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
import { filter, isEmpty, isNil } from 'ramda'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import { DatePicker, Filter, Icon } from '@components'
import AppActions from '~/actions/app'
import MngActions from '~/actions/manage'
import { CompanyDevelopTabs, SPECIALOPTIONS } from '~/services/config'
import { exportMultipleCsv } from '~/services/util'
import TrainingCompetencyPdf from './TrainingCompetencyPdf'
import Report from './Report'

const moment = extendMoment(originalMoment)

class TrainingCompetency extends React.Component {
  state = {
    userId: this.props.userId,
    user: {
      id: this.props.userId,
    },
    filter: 'employee',
    companyId: this.props.company.id,
    startDate: moment().startOf('month'),
    endDate: moment().endOf('month'),
    activeTab: 'overall',
    processReport: [],
    skillsReport: [],
    productKnowledgeReport: [],
    tempermentReport: [],
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { trainingCompetencyReport } = nextProps
    const { activeTab } = prevState

    let processReport = []
    let skillsReport = []
    let productKnowledgeReport = []
    let tempermentReport = []

    if (!isNil(trainingCompetencyReport)) {
      processReport =
        isEmpty(trainingCompetencyReport.process) || isNil(trainingCompetencyReport.process)
          ? []
          : activeTab == 'overall'
          ? trainingCompetencyReport.process.data
          : filter(item => item.category === activeTab, trainingCompetencyReport.process.data)
      skillsReport =
        isEmpty(trainingCompetencyReport.skills) || isNil(trainingCompetencyReport.skills)
          ? []
          : activeTab == 'overall'
          ? trainingCompetencyReport.skills.data
          : filter(item => item.category === activeTab, trainingCompetencyReport.skills.data)
      productKnowledgeReport =
        isEmpty(trainingCompetencyReport.product_knowledge) || isNil(trainingCompetencyReport.product_knowledge)
          ? []
          : activeTab == 'overall'
          ? trainingCompetencyReport.product_knowledge.data
          : filter(item => item.category === activeTab, trainingCompetencyReport.product_knowledge.data)
      tempermentReport =
        isEmpty(trainingCompetencyReport.temperament) || isNil(trainingCompetencyReport.temperament)
          ? []
          : activeTab == 'overall'
          ? trainingCompetencyReport.temperament.data
          : filter(item => item.category === activeTab, trainingCompetencyReport.temperament.data)
      return { processReport, skillsReport, productKnowledgeReport, tempermentReport }
    } else return null
  }

  componentDidMount() {
    const { startDate, endDate, userId } = this.state
    const payload = {
      user_id: userId,
      date_start: startDate,
      date_end: endDate,
    }
    this.props.getReports(payload)
  }

  handleFilter = (type, data) => {
    const { startDate, endDate, companyId } = this.state
    if (data.length == 0) return
    if (type == 'employee') {
      const userId = data[0].id
      if (SPECIALOPTIONS.ALL == data[0].id) {
        const payload = {
          company_id: [companyId],
          date_start: startDate,
          date_end: endDate,
        }
        this.props.getReports(payload)
        this.setState({ filter: 'company' })
      } else {
        const payload = {
          user_id: [userId],
          date_start: startDate,
          date_end: endDate,
        }
        this.props.getReports(payload)
        this.setState({ user: data[0], userId, filter: 'employee' })
      }
    }
    if (type == 'company') {
      const payload = {
        company_id: [data[0].id],
        date_start: startDate,
        date_end: endDate,
      }
      this.props.getReports(payload)
      this.setState({ companyId: data[0].id, filter: 'company' })
    }
  }

  handleDate = e => {
    const { userId, filter, companyId } = this.state
    const startDate = moment(e.start)
    const endDate = moment(e.end)
    let payload = {}
    if (filter == 'employee') {
      payload = {
        user_id: [userId],
        date_start: startDate,
        date_end: endDate,
      }
    } else {
      payload = {
        company_id: [companyId],
        date_start: startDate,
        date_end: endDate,
      }
    }

    this.props.getReports(payload)

    this.setState({ startDate, endDate })
  }

  handleTab = activeTab => {
    this.setState({ activeTab })
  }

  handlePdf = async () => {
    const {
      startDate,
      endDate,
      activeTab,
      processReport,
      skillsReport,
      productKnowledgeReport,
      tempermentReport,
    } = this.state
    const date = moment.range(startDate, endDate)
    const pdfData = {
      date: date,
      activeTab: activeTab,
      process: processReport,
      skills: skillsReport,
      productKnowledge: productKnowledgeReport,
      temperment: tempermentReport,
    }
    const bolb = await TrainingCompetencyPdf(pdfData)
    const url = URL.createObjectURL(bolb)
    window.open(url, '__blank')
  }

  handleExcelReport = () => {
    this.props.toggleModal({
      type: 'Confirm',
      data: {
        before: {
          title: 'Confirm',
          body: 'Would you like to download this reports data to excel?',
        },
      },
      callBack: {
        onYes: () => {
          this.handleExcel()
        },
      },
    })
  }

  handleExcel = () => {
    const { activeTab, processReport, skillsReport, productKnowledgeReport, tempermentReport } = this.state
    const processData = []
    const skillsData = []
    const productKnowledgeData = []
    const tempermentData = []
    processReport.map(item => {
      const { data, children_complete, children_past_due } = item
      const { child_count, name } = data
      const excelData = {
        Training: name,
        Modules: child_count || 0,
        Completed: children_complete,
        'Past Due': children_past_due,
      }
      processData.push(excelData)
    })
    skillsReport.map(item => {
      const { data, children_complete, children_past_due } = item
      const { child_count, name } = data
      const excelData = {
        Training: name,
        Modules: child_count || 0,
        Completed: children_complete,
        'Past Due': children_past_due,
      }
      skillsData.push(excelData)
    })
    productKnowledgeReport.map(item => {
      const { data, children_complete, children_past_due } = item
      const { child_count, name } = data
      const excelData = {
        Training: name,
        Modules: child_count || 0,
        Completed: children_complete,
        'Past Due': children_past_due,
      }
      productKnowledgeData.push(excelData)
    })
    tempermentReport.map(item => {
      const { data, children_complete, children_past_due } = item
      const { child_count, name } = data
      const excelData = {
        Training: name,
        Modules: child_count || 0,
        Completed: children_complete,
        'Past Due': children_past_due,
      }
      tempermentData.push(excelData)
    })
    const key = ['Training', 'Modules', 'Completed', 'Past Due']
    const data = [processData, skillsData, productKnowledgeData, tempermentData]
    const sheetName = ['Process', 'Skills', 'Product Knowledge', 'Temperment ']
    exportMultipleCsv(data, key, sheetName, `Taining-Competency-${activeTab}`)
  }

  render() {
    const {
      activeTab,
      startDate,
      endDate,
      processReport,
      skillsReport,
      productKnowledgeReport,
      tempermentReport,
    } = this.state
    const date = moment.range(startDate, endDate)

    return (
      <div className="training-competency-report">
        <Filter type="individual" mountEvent removed={[[], [SPECIALOPTIONS.LIST]]} onChange={this.handleFilter} />
        <div className="card">
          <div className="d-flex justify-content-between mb-2 mt-4 align-items-center">
            <span className="dsl-b22 bold">Training Competency Report</span>
            <div className="d-flex">
              <DatePicker
                calendar="range"
                append="caret"
                format="MMM DD"
                as="span"
                align="right"
                append="caret"
                value={date}
                onSelect={this.handleDate}
              />
              <div className="d-flex justify-content-end cursor-pointer ml-3" onClick={this.handlePdf}>
                <Icon name="fal fa-print" color="#343f4b" size={16} />
              </div>
              <div className="d-flex justify-content-end cursor-pointer ml-3" onClick={this.handleExcelReport}>
                <Icon name="fal fa-file-excel" color="#343f4b" size={16} />
              </div>
            </div>
          </div>
          <Tabs
            defaultActiveKey="overall"
            activeKey={activeTab}
            id="records"
            onSelect={this.handleTab}
            className="py-3 py-md-4 d-none d-md-flex"
          >
            {CompanyDevelopTabs.map(tab => (
              <Tab key={tab.name} eventKey={tab.name} title={tab.label}>
                <Report
                  process={processReport}
                  skills={skillsReport}
                  productKnowledge={productKnowledgeReport}
                  temperment={tempermentReport}
                />
              </Tab>
            ))}
          </Tabs>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  userId: state.app.id,
  company: state.app.companies[0],
  trainingCompetencyReport: state.manage.trainingCompetencyReport,
})

const mapDispatchToProps = dispatch => ({
  getReports: payload => dispatch(MngActions.posttrainingcompetencyreportRequest(payload)),
  toggleModal: payload => dispatch(AppActions.modalRequest(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TrainingCompetency)

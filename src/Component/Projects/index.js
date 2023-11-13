import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import ProjectCard from '../ProjectCard'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class Projects extends Component {
  state = {
    selectOption: categoriesList[0].id,
    list: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjects()
  }

  onChangeSelect = event => {
    this.setState({selectOption: event.target.value}, () => this.getProjects())
  }

  getProjects = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {selectOption} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${selectOption}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))
      this.setState({apiStatus: apiStatusConstants.success, list: updatedData})
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onRetry = () => {
    this.getProjects()
  }

  renderProjects = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  renderSuccessView = () => {
    const {list} = this.state

    return (
      <ul>
        {list.map(eachItem => (
          <ProjectCard key={eachItem.id} cardDetails={eachItem} />
        ))}
      </ul>
    )
  }

  renderLoaderView = () => (
    <div data-testid="loader">
      <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  render() {
    const {selectOption} = this.state
    return (
      <>
        <Header />
        <div>
          <select onChange={this.onChangeSelect} value={selectOption}>
            {categoriesList.map(eachItem => (
              <option key={eachItem.id} value={eachItem.id}>
                {eachItem.displayText}
              </option>
            ))}
          </select>
          {this.renderProjects()}
        </div>
      </>
    )
  }
}

export default Projects

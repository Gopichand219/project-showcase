import {Component} from 'react'
import Loader from 'react-loader-spinner'

import ProjectItem from '../ProjectItem'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN PROGRESS',
  initial: 'INITIAL',
}

class ProjectsShowcase extends Component {
  state = {
    activeCategory: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
    projectsList: [],
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeCategory} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeCategory}`
    const response = await fetch(apiUrl)
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      console.log(updatedData)
      this.setState({
        apiStatus: apiStatusConstants.success,
        projectsList: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeCategory = event => {
    this.setState({activeCategory: event.target.value}, this.getProjects)
  }

  renderProjectsList = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderSuccessView = () => {
    const {projectsList} = this.state

    return (
      <ul className="list">
        {projectsList.map(each => (
          <ProjectItem projectDetails={each} key={each.id} />
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.getProjects()} className="retry-btn">
        Retry
      </button>
    </div>
  )

  render() {
    const {activeCategory} = this.state

    return (
      <div>
        <nav className="projects-navbar">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </nav>
        <div>
          <select
            value={activeCategory}
            onChange={this.onChangeCategory}
            className="drop-down"
          >
            {categoriesList.map(each => (
              <option value={each.id}>{each.displayText}</option>
            ))}
          </select>
        </div>
        {this.renderProjectsList()}
      </div>
    )
  }
}

export default ProjectsShowcase

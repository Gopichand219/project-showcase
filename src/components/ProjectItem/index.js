import './index.css'

const ProjectItem = props => {
  const {projectDetails} = props
  const {imageUrl, name} = projectDetails

  return (
    <li className="list-item">
      <img src={imageUrl} alt={name} className="image" />
      <p>{name}</p>
    </li>
  )
}

export default ProjectItem

const ProjectCard = props => {
  const {CardDetails} = props
  const {name, imageUrl} = CardDetails

  return (
    <li>
      <div>
        <img src={imageUrl} alt={name} />
        <p>{name}</p>
      </div>
    </li>
  )
}

export default ProjectCard

export default function Resume({ resume }) {
  const { education, skills, work } = resume
  return (
    <>
      <section>
        <h2>Education</h2>
        {education.map((edu) => (
          <div key={edu.institution}>
            <div>
              {edu.institution}, {edu.startDate} - {edu.endDate}
            </div>
          </div>
        ))}
      </section>
      <section>
        <h2>Skills</h2>
      </section>
      <section>
        <h2>Work Experience</h2>
      </section>
    </>
  )
}

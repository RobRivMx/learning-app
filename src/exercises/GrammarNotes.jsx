// src/exercises/GrammarNotes.jsx

function GrammarNotes({ exerciseData }) {
  return (
    <div className="grammar-notes" style={{marginBottom: '2rem'}}>
      <h3>💡 {exerciseData.title}</h3>
      {exerciseData.points.map((point, index) => (
        <div key={index} style={{marginTop: '1rem'}}>
          <p><strong>{point.header}</strong></p>
          {/* Usamos pre-wrap para respetar los saltos de línea del texto */}
          <p style={{whiteSpace: 'pre-wrap'}}>{point.content}</p>
        </div>
      ))}
    </div>
  );
}

export default GrammarNotes;
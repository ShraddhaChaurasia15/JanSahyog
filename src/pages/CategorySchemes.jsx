import { useParams } from "react-router-dom";
import schemesData from "../data/schemes.json";

function CategorySchemes() {
  const { category } = useParams();

  const categorySchemes = schemesData.filter(
    (scheme) => scheme.category === category
  );

  return (
    <div
      style={{
        paddingTop: "120px",
        paddingLeft: "50px",
        paddingRight: "50px"
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "50px",
          color: "#1e3a8a"
        }}
      >
        {category.toUpperCase()} SCHEMES
      </h1>

      {categorySchemes.map((scheme) => (
        <div
          key={scheme.id}
          style={{
            background: "#fff",
            padding: "25px",
            marginBottom: "20px",
            borderRadius: "12px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
          }}
        >
          <h2
  style={{
    color: "#1e3a8a",
    marginBottom: "10px"
  }}
>
  {scheme.name}
</h2>

<p
  style={{
    marginBottom: "20px"
  }}
>
  {scheme.description}
</p>
<h4>Eligibility</h4>

<ul>
  {scheme.eligibility?.map((item, index) => (
    <li key={index}>{item}</li>
  ))}
</ul>
<div
  style={{
    marginTop: "20px",
    display: "flex",
    gap: "15px"
  }}
>

  <button
    onClick={() =>
      window.open(scheme.applyLink, "_blank")
    }
    style={{
      background: "#2563eb",
      color: "white",
      border: "none",
      padding: "12px 20px",
      borderRadius: "8px",
      cursor: "pointer"
    }}
  >
    Apply Now
  </button>

  <button
    onClick={() =>
      window.open(scheme.officialWebsite, "_blank")
    }
    style={{
      background: "#f1f5f9",
      color: "#0f172a",
      border: "1px solid #cbd5e1",
      padding: "12px 20px",
      borderRadius: "8px",
      cursor: "pointer"
    }}
  >
    Official Website
  </button>

</div>

          
        </div>
      ))}
    </div>
  );
}

export default CategorySchemes;
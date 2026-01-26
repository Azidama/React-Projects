export const MoodBoardItem = ({color, image, description}) => {
    return (
      <div 
        className="mood-board-item"
        style={{
          backgroundColor: color
        }}
      >
        <img 
          src={image}
          className="mood-board-image"
        />
        <h3 className="mood-board-text">{description}</h3>
      </div>
    )
  }
  
  export const MoodBoard = () => {
    const bgColor = "#f9b86b"
    const objects = [
      {
        image: "https://cdn.freecodecamp.org/curriculum/labs/pathway.jpg",
        color: bgColor,
        description: "tree"
      },
      {
        image: "https://cdn.freecodecamp.org/curriculum/labs/shore.jpg",
        color: bgColor,
        description: "rock"
      },
      {
        image: "https://cdn.freecodecamp.org/curriculum/labs/grass.jpg",
        color: bgColor,
        description: "wotah n gras"
      },
      {
        image: "https://cdn.freecodecamp.org/curriculum/labs/ship.jpg",
        color: bgColor,
        description: "ship"
      },
      {
        image: "https://cdn.freecodecamp.org/curriculum/labs/santorini.jpg",
        color: bgColor,
        description: "ting"
      },
      {
        image: "https://cdn.freecodecamp.org/curriculum/labs/pigeon.jpg",
        color: bgColor,
        description: "birb"
      }
    ]
    return (
      <div>
        <h1 className="mood-board-heading">Destination Mood Board</h1>
        <div className="mood-board">
          {objects.map(item => (
            <MoodBoardItem
              {...item}
            />
          )
          )}
        </div>
      </div>
    )
  }
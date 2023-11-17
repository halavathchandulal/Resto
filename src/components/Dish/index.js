import './index.css'

const Dish = ({
  dish,
  onIncrement,
  onDecrement,
  quantity,
  cart,
  activeCategory,
}) => {
  const handleIncrement = dishId => {
    onIncrement(dishId)
  }

  const handleDecrement = dishId => {
    onDecrement(dishId)
  }

  const isSaladsAndSoupCategory = activeCategory === 'Salads and Soup'
  const isFastFoodCategory = activeCategory === 'Fast Food'
  const isBiryaniCategory = activeCategory === 'Biryani'
  const isFreshFromTheSeaCategory = activeCategory === 'Fresh From The Sea'
  const isFromTheHenHouseCategory = activeCategory === 'From the Hen House'
  const isFromTheBarnyardCategory = activeCategory === 'From the Barnyard'

  return (
    <div>
      <h3>{dish.dish_name}</h3>
      <p>
        {dish.dish_currency} {dish.dish_price}
      </p>
      <p>{dish.dish_description}</p>
      <p>{dish.dish_calories} calories</p>

      {/* Conditional rendering based on active category */}
      {isFastFoodCategory && dish.addonCat && <p>Customizations available</p>}
      {isBiryaniCategory && !dish.addonCat && (
        <p>No customizations available</p>
      )}
      {!isFreshFromTheSeaCategory && dish.dish_Availability === false && (
        <p>Not available</p>
      )}
      {isSaladsAndSoupCategory && <img src={dish.dish_image} alt="Dish" />}

      {/* Increment and Decrement buttons */}
      {quantity !== undefined && !isFreshFromTheSeaCategory && (
        <div>
          <button type="button" onClick={() => handleDecrement(dish.dish_id)}>
            -
          </button>
          <span>{cart[dish.dish_id] || 0}</span>
          <button type="button" onClick={() => handleIncrement(dish.dish_id)}>
            +
          </button>
        </div>
      )}

      {isFromTheHenHouseCategory && <p>Dish Quantity: {quantity || 0}</p>}

      {isFromTheBarnyardCategory && <img src={dish.dish_image} alt="Dish" />}
    </div>
  )
}

export default Dish

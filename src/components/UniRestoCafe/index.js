import {useEffect, useState} from 'react'
import CategoryMenu from '../CategoryMenu'
import Dish from '../Dish'

const UniRestoCafe = () => {
  const [restaurantInfo, setRestaurantInfo] = useState({})
  const [menuData, setMenuData] = useState([])
  const [activeCategory, setActiveCategory] = useState('')
  const [cart, setCart] = useState({})
  const [totalDishQuantity, setTotalDishQuantity] = useState(0)
  const [categoryQuantity, setCategoryQuantity] = useState({})

  useEffect(() => {
    const dishesApiUrl =
      'https://run.mocky.io/v3/77a7e71b-804a-4fbd-822c-3e365d3482cc'

    const fetchData = async () => {
      try {
        const response = await fetch(dishesApiUrl)
        const data = await response.json()

        setRestaurantInfo({
          restaurantId: data.restaurant_id,
          restaurantName: data.restaurant_name,
          restaurantImage: data.restaurant_image,
          tableId: data.table_id,
          tableName: data.table_name,
          branchName: data.branch_name,
        })

        setMenuData(data[0].table_menu_list || [])

        setActiveCategory(
          data[0].table_menu_list && data[0].table_menu_list.length > 0
            ? data[0].table_menu_list[0].menu_category
            : '',
        )

        const categoryQuantities = data[0].table_menu_list.reduce(
          (quantities, category) => ({
            ...quantities,
            [category.menu_category]: 0,
          }),
          {},
        )
        setCategoryQuantity(categoryQuantities)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const handleCategoryChange = category => {
    setActiveCategory(category)
  }

  const getTotalQuantityForCategory = category => {
    let total = 0
    menuData.forEach(cat => {
      if (cat.menu_category === category) {
        cat.category_dishes.forEach(dish => {
          total += cart[dish.dish_id] || 0
        })
      }
    })
    return total
  }

  const handleIncrement = (dishId, category) => {
    switch (activeCategory) {
      case 'Salads and Soup':
        if (cart[dishId] === 0) {
          setCart(prevCart => ({
            ...prevCart,
            [dishId]: (prevCart[dishId] || 0) + 1,
          }))
          setTotalDishQuantity(prevTotal => prevTotal + 1)
          setCategoryQuantity(prevQty => ({
            ...prevQty,
            [category]: (prevQty[category] || 0) + 1,
          }))
        }
        break

      default:
        setCart(prevCart => ({
          ...prevCart,
          [dishId]: (prevCart[dishId] || 0) + 1,
        }))
        setTotalDishQuantity(prevTotal => prevTotal + 1)
        setCategoryQuantity(prevQty => ({
          ...prevQty,
          [category]: (prevQty[category] || 0) + 1,
        }))
        break
    }
  }

  const handleDecrement = (dishId, category) => {
    switch (activeCategory) {
      case 'Salads and Soup':
        if (cart[dishId] > 0) {
          setCart(prevCart => ({
            ...prevCart,
            [dishId]: prevCart[dishId] - 1,
          }))
          setTotalDishQuantity(prevTotal => prevTotal - 1)
          setCategoryQuantity(prevQty => ({
            ...prevQty,
            [category]: prevQty[category] - 1,
          }))
        }
        break

      default:
        if (cart[dishId] > 0) {
          setCart(prevCart => ({
            ...prevCart,
            [dishId]: prevCart[dishId] - 1,
          }))
          setTotalDishQuantity(prevTotal => prevTotal - 1)
          setCategoryQuantity(prevQty => ({
            ...prevQty,
            [category]: prevQty[category] - 1,
          }))
        }
        break
    }
  }

  const displayDetailsBasedOnCategory = () => {
    const currentCategory = menuData.find(
      cat => cat.menu_category === activeCategory,
    )

    if (currentCategory) {
      if (activeCategory === 'Fast Food') {
        return (
          <div>
            {currentCategory.addonCat && (
              <p>Customizations available: {currentCategory.addonCat}</p>
            )}
            {currentCategory.category_dishes.map(dish => (
              <Dish
                key={dish.dish_id}
                dish={dish}
                quantity={cart[dish.dish_id] || 0}
                cart={cart}
                activeCategory={activeCategory}
                onIncrement={() =>
                  handleIncrement(dish.dish_id, activeCategory)
                }
                onDecrement={() =>
                  handleDecrement(dish.dish_id, activeCategory)
                }
              />
            ))}
          </div>
        )
      }

      return currentCategory.category_dishes.map(dish => (
        <Dish
          key={dish.dish_id}
          dish={dish}
          quantity={cart[dish.dish_id] || 0}
          cart={cart}
          activeCategory={activeCategory}
          onIncrement={() => handleIncrement(dish.dish_id, activeCategory)}
          onDecrement={() => handleDecrement(dish.dish_id, activeCategory)}
        />
      ))
    }

    return null
  }

  return (
    <div>
      <h1> {restaurantInfo.restaurantName || 'UNI Resto Cafe'} </h1>{' '}
      <header>
        <h2> My Orders </h2> <p> Total Dish Quantity: {totalDishQuantity} </p>{' '}
      </header>{' '}
      <CategoryMenu
        menuData={menuData}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
      <div>
        {' '}
        {activeCategory && (
          <div>
            <h3> {activeCategory} </h3> {displayDetailsBasedOnCategory()}{' '}
            <footer>
              <p> Cart Count: {getTotalQuantityForCategory(activeCategory)} </p>{' '}
            </footer>{' '}
          </div>
        )}{' '}
      </div>{' '}
      <div>
        <h3> Cart Total </h3>{' '}
        {Object.entries(categoryQuantity).map(([category, quantity]) => (
          <p key={category}>
            {' '}
            {category}: {quantity}{' '}
          </p>
        ))}{' '}
      </div>{' '}
    </div>
  )
}

export default UniRestoCafe

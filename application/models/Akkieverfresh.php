<?php
class Akkieverfresh extends CI_Model {
  	public function __construct() {
		parent::__construct();
		$this->load->database(); 
		$this->load->model('Akkieverfresh');
		$this->load->helper('url');
  	}

  	public function lookup_signup($name,$email,$password) {
		$this->db->select('*');
		$this->db->where("email",$email);
	    $query = $this->db->get("user_details");
	    if ($query->num_rows() > 0) {
	    	return false;
	    } else {
	    	$data = array('email' => $email,'password' => $password, 'name' => $name);
	    	$this->db->insert('user_details', $data);
	    	return true;
	    }
	}

	public function look_login($email,$password) {
		$data = array('email' => $email,'password' => $password);
		$this->db->select('*');
		//$this->db->order_by("u_id","desc");
		$this->db->where($data);
	    $query = $this->db->get("user_details");
	    if ($query->num_rows() > 0) {
	    	return true;	    	
	    } else {
	    	return false;
	    }
	}

	public function get_Category_List() {
		$this->db->select('*');
		$query = $this->db->get('fast_food_categories');
		if ($query->num_rows() > 0) 
	    {
	        foreach ($query->result() as $row) 
	        {
	            $data[] = $row;
	        }
	     	return $data;
	    }
	    return false;
	}

	public function submit_New_Category($cat) {
		$data = array('category' => $cat);
		$query = $this->db->insert('fast_food_categories', $data);
		if ($query == true) {
			return true;
		} else {
			return false;
		}
		// $this->db->select('id');
		// $this->db->where("category",$cat);
		// $query = $this->db->get("fast_food_categories");
		// if ($query->num_rows() > 0) {
			// foreach ($query->result() as $row) {
			    // $cat_id = $row->id;
				// return $cat_id;
		// 	}
		// }
	}

	public function submitItemWithRate($cat,$item,$regular_item,$small_item,$medium_item,$large_item,$extralarge_item,$regular_item_price,$small_item_price,$medium_item_price,$large_item_price,$extralarge_item_price) {

		$item_id = $this->checkItem($item, $cat);

		if ($small_item != 'null') {
			$small_item_Id = $this->submit_small_Item($small_item, $small_item_price, $item_id);
		} else {
			$small_item_Id = 'null';
		}

		if ($medium_item != 'null') {
			$medium_item_Id = $this->submit_medium_Item($medium_item, $medium_item_price, $item_id);
		} else {
			$medium_item_Id = 'null';
		}

		if ($regular_item != 'null') {
			$regular_item_Id = $this->submit_regular_Item($regular_item, $regular_item_price, $item_id);
		} else {
			$regular_item_Id = 'null';
		}

		if ($large_item != 'null') {
			$large_item_Id = $this->submit_large_Item($large_item, $large_item_price, $item_id);
		} else {
			$large_item_Id = 'null';
		}

		if ($extralarge_item != 'null') {
			$extralarge_item_Id = $this->submit_extralarge_Item($extralarge_item, $extralarge_item_price, $item_id);
		} else {
			$extralarge_item_Id = 'null';
		}

		$this->submitItem($item_id, $small_item_Id, $medium_item_Id, $regular_item_Id, $large_item_Id, $extralarge_item_Id);
	}

	public function checkItem($item, $cat) {

		$this->db->select('id');
		$this->db->where("items",$item);
		$query = $this->db->get("fast_food_items");
		if ($query->num_rows() > 0) {
			foreach ($query->result() as $row) {
				$item_id = $row->id;
			}
			return $item_id;
		} else {
			$data = array('items' => $item, 'cat_id' => $cat);
			$this->db->insert('fast_food_items', $data);
			$this->db->select('id');
			$this->db->where("items",$item);
			$query = $this->db->get("fast_food_items");
			if ($query->num_rows() > 0) {
				foreach ($query->result() as $row) {
					$item_id = $row->id;
					return $item_id;
				}
			}
		}
	}
	
	public function submitCategory($cat) {
		if ($cat) {
			$this->db->select('id');
			$this->db->where("category",$cat);
			$query = $this->db->get("fast_food_categories");
			if ($query->num_rows() > 0) {
				return "false";
			} else {
				$data = array('category' => $cat);
				$query = $this->db->insert('fast_food_categories', $data);
				return $query;
			}
		}
	}

	public function submit_small_Item($small_item, $small_item_price, $item_id) {
		$price_id = $this->submitPrice($small_item_price);
		$data = array('belongs_to' => $item_id, 'item_name' => $small_item , 'price_id' => $price_id);
		$this->db->insert('item_size_type', $data);
		$this->db->select('id');
		$this->db->where('item_name', $small_item);
		$query = $this->db->get("item_size_type");
		if ($query->num_rows() > 0) {
			foreach ($query->result() as $row) 
			{
			    $res = $row->id;
			}
		return $res;
		}
	}

	public function submit_medium_Item($medium_item, $medium_item_price, $item_id) {
		$price_id = $this->submitPrice($medium_item_price);
		$data = array('belongs_to' => $item_id, 'item_name' => $medium_item , 'price_id' => $price_id);
		$this->db->insert('item_size_type', $data);
		$this->db->select('id');
		$this->db->where('item_name', $medium_item);
		$query = $this->db->get("item_size_type");
		if ($query->num_rows() > 0) {
			foreach ($query->result() as $row) 
			{
			    $res = $row->id;
			}
		return $res;
		}
	}

	public function submit_regular_Item($regular_item, $regular_item_price, $item_id) {
		$price_id = $this->submitPrice($regular_item_price);
		$data = array('belongs_to' => $item_id, 'item_name' => $regular_item , 'price_id' => $price_id);
		$this->db->insert('item_size_type', $data);
		$this->db->select('id');
		$this->db->where('item_name', $regular_item);
		$query = $this->db->get("item_size_type");
		if ($query->num_rows() > 0) {
			foreach ($query->result() as $row) 
			{
			    $res = $row->id;
			}
		return $res;
		}
	}

	public function submit_large_Item($large_item, $large_item_price, $item_id) {
		$price_id = $this->submitPrice($large_item_price);
		$data = array('belongs_to' => $item_id, 'item_name' => $large_item , 'price_id' => $price_id);
		$this->db->insert('item_size_type', $data);
		$this->db->select('id');
		$this->db->where('item_name', $large_item);
		$query = $this->db->get("item_size_type");
		if ($query->num_rows() > 0) {
			foreach ($query->result() as $row) 
			{
			    $res = $row->id;
			}
		return $res;
		}
	}

	public function submit_extralarge_Item($extralarge_item, $extralarge_item_price, $item_id) {
		$price_id = $this->submitPrice($extralarge_item_price);
		$data = array('belongs_to' => $item_id, 'item_name' => $extralarge_item , 'price_id' => $price_id);
		$this->db->insert('item_size_type', $data);
		$this->db->select('id');
		$this->db->where('item_name', $extralarge_item);
		$query = $this->db->get("item_size_type");
		if ($query->num_rows() > 0) {
			foreach ($query->result() as $row) 
			{
			    $res = $row->id;
			}
		return $res;
		}
	}

	public function submitPrice($price) {
		if ($price) {
		$this->db->select('id');
			$this->db->where("price",$price);
			$query = $this->db->get("price_table");
			if ($query->num_rows() > 0) {
				foreach ($query->result() as $row) {
					$price_id = $row->id;
				}
				return $price_id;
			} else {
				$data = array('price' => $price);
				$this->db->insert('price_table', $data);
				$this->db->select('id');
				$this->db->where("price",$price);
				$query = $this->db->get("price_table");
				if ($query->num_rows() > 0) {
					foreach ($query->result() as $row) {
					    $price_id = $row->id;
					}
				return $price_id;
				}
			}
		}
	}

	public function submitItem($item_id, $small_item_Id, $medium_item_Id, $regular_item_Id, $large_item_Id, $extralarge_item_Id) {
		$data = array("small_size" => $small_item_Id,"medium_size" => $medium_item_Id,"large_size" => $large_item_Id ,"extralarge_size" => $extralarge_item_Id, "regular_size" => $regular_item_Id );
		$this->db->where("id",$item_id);
		$sm = $this->db->update('fast_food_items', $data);
	}

	public function getCategoryName($item_category) {
		if ($item_category) {
			$this->db->select('category');
			$this->db->where("id",$item_category);
			$query = $this->db->get("fast_food_categories");
			if ($query->num_rows() > 0) {
				foreach ($query->result() as $row) {
					$cat_name = $row->category;
					return $cat_name;
				}
			} else {
			}
		}
	}

	public function getItemPrice($item_rate) {
		if ($item_rate) {
			$this->db->select('price');
			$this->db->where("id",$item_rate);
			$query = $this->db->get("price_table");
			if ($query->num_rows() > 0) {
				foreach ($query->result() as $row) {
					$item_price = $row->price;
					return $item_price;
				}
			} else {
			}
		}
	}

	public function get_categories_from_database() {
		$this->db->select('*');
		$query = $this->db->get('fast_food_categories');
		if ($query->num_rows() > 0) {
			foreach ($query->result() as $row) {
				$category[] = $row;
			}
		}
		return $category;
	}

	public function get_catwise_food_items_from_database($catId) {
		$this->db->select('*');
		$this->db->where('cat_id', $catId);
		$query = $this->db->get('fast_food_items');
		if ($query->num_rows() > 0) {
			foreach ($query->result() as $row) {
				$foodItems[] = $row;
			}
		}
		return $foodItems;	
	}

	public function getItemDetail($itemcode) {
		if ($itemcode) {
			$var = array();
			$this->db->select('*');
			$this->db->where("id",$itemcode);
			$query = $this->db->get("fast_food_items");
			if ($query->num_rows() > 0) {
				foreach ($query->result() as $row) {

					$item_category = $row->cat_id;
					
					$small_item = $row->small_size;
					$medium_item = $row->medium_size;
					$regular_item = $row->regular_size;
					$large_item = $row->large_size;
					$extralarge_item = $row->extralarge_size;
					$item_category = $row->extralarge_size;
					
					$res['small'] = $this->get_item_details($small_item);
					$res['medium'] = $this->get_item_details($medium_item);
					$res['regular'] = $this->get_item_details($regular_item);
					$res['large'] = $this->get_item_details($large_item);
					$res['extralarge'] = $this->get_item_details($extralarge_item);

					if ($res['small'] != null) {
						array_push($var,$res['small'] );
					}

					if ($res['medium'] != null) {
						array_push($var,$res['medium'] );
					}

					if ($res['regular'] != null) {
						array_push($var,$res['regular'] );
					}

					if ($res['large'] != null) {
						array_push($var,$res['large'] );
					}

					if ($res['extralarge'] != null) {
						array_push($var,$res['extralarge'] );
					}
				}
				return $var;
			}
		} else {
			return false;
		}
	}

	public function get_item_details($item_id) {
		$this->db->select('*');
		$this->db->where("id",$item_id);
		$query = $this->db->get("item_size_type");
		if ($query->num_rows() > 0) {
			foreach ($query->result() as $row) {
				$item_price = $row->price_id;
				$row->price_is = $this->get_price($item_price);
				return $row;
			}
		}
	}

	public function get_price($item_rate) {
		if ($item_rate) {
			$this->db->select('price');
			$this->db->where("id",$item_rate);
			$query = $this->db->get("price_table");
			if ($query->num_rows() > 0) {
				foreach ($query->result() as $row) {
					$item_price = $row->price;
					return $item_price;
				}
			} else {
			}
		}
	}
}
?>
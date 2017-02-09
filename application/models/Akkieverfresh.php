<?php
class Akkieverfresh extends CI_Model
{
  	public function __construct()
  	{
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


	public function submitItemWithRate($cat,$item,$price) {
		$catId = $this->submitCategory($cat);
		$price_id = $this->submitPrice($price);
		// return $price_id;
		if ($item) {
			$this->db->select('id');
			$this->db->where("items",$item);
			$query = $this->db->get("fastfooditems");
			if ($query->num_rows() > 0) {
			// 	foreach ($query->result() as $row) {
			// 		$item_id = $row->id;
				return false;
			} else {
				$data = array('items' => $item, 'cat_id' => $catId, 'price_id' => $price_id);
				$query = $this->db->insert('fastfooditems', $data);
				return true;
			}
		} else {
			return "something went wrong";
		}
	}
	
	public function submitCategory($cat) {
		if ($cat) {
			$this->db->select('id');
			$this->db->where("category",$cat);
			$query = $this->db->get("fastfoodcategories");
			if ($query->num_rows() > 0) {
				foreach ($query->result() as $row) {
					$cat_id = $row->id;
					return $cat_id;
				}
			} else {
				$data = array('category' => $cat);
				$this->db->insert('fastfoodcategories', $data);
				$this->db->select('id');
				$this->db->where("category",$cat);
				$query = $this->db->get("fastfoodcategories");
				if ($query->num_rows() > 0) {
					foreach ($query->result() as $row) 
					{
					    $cat_id = $row->id;
						return $cat_id;
					}
				}
			}
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
					foreach ($query->result() as $row) 
					{
					    $price_id = $row->id;
					}
				return $price_id;
				}
			}
		}
	}

	public function submitItem($item) {
		if ($item) {
			$this->db->select('id');
			$this->db->where("items",$item);
			$query = $this->db->get("fastfooditems");
			if ($query->num_rows() > 0) {
				foreach ($query->result() as $row) {
					$item_id = $row->id;
				}
			return $item_id;
			} else {
				$data = array('items' => $item);
				$this->db->insert('fastfooditems', $data);
				$this->db->select('id');
				$this->db->where("items",$item);
				$query = $this->db->get("fastfooditems");
				if ($query->num_rows() > 0) {
					foreach ($query->result() as $row) 
					{
					    $item_id = $row->id;
					}
				return $item_id;
				}
			}
		}
	}

	public function getItemDetail($itemcode) {
		if ($itemcode) {
			// return true;
			$this->db->select('*');
			$this->db->where("id",$itemcode);
			$query = $this->db->get("fastfooditems");
			if ($query->num_rows() > 0) {
				foreach ($query->result() as $row) {
					$res['item_name'] = $row->items;
					$item_rate = $row->price_id;
					$item_category = $row->cat_id;
					$res['catId'] = $this->getCategoryName($item_category);
					$res['price_id'] = $this->getItemPrice($item_rate);
					return $res;
				}
			} else {
			}
		} else {
			return false;
		}
	}

	public function getCategoryName($item_category) {
		if ($item_category) {
			$this->db->select('category');
			$this->db->where("id",$item_category);
			$query = $this->db->get("fastfoodcategories");
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
		$query = $this->db->get('fastfoodcategories');
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
		$query = $this->db->get('fastfooditems');
		if ($query->num_rows() > 0) {
			foreach ($query->result() as $row) {
				$foodItems[] = $row;
			}
		}
		return $foodItems;	
	}
}
?>
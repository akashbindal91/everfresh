<?php
require_once(APPPATH.'/libraries/REST_Controller.php');
class Homepage extends REST_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->model('Akkieverfresh');
		$this->load->helper('url');
	}

	public function index_get() {
		$this->load->view("homepage2.html");
	}

	public function secondView_get() {
		// $this->load->view("secondView.html");
		$this->load->view("secondView_trial.html");
	}

	public function mainView_get() {
		$this->load->view("mainView.html");
	}

	public function submitCategory_post() {
		$postdata = file_get_contents("php://input");
		$request  = json_decode($postdata);
		$cat = $request->cat;
		$query["category_datas"] = $this->Akkieverfresh->submitCategory($cat);
		$this->response($query);
	}

	public function submitItemWithRate_post() {
		$postdata = file_get_contents("php://input");
		$request  = json_decode($postdata);

		$cat = $request->cat;	
		$item = $request->item;

		$regular_item = $request->regularDish;
		$small_item = $request->smallDish;
		$medium_item = $request->mediumDish;
		$large_item = $request->largeDish;
		$extralarge_item = $request->extralargeDish;

		$regular_item_price = $request->regularDishPrice;
		$small_item_price = $request->smallDishPrice;
		$medium_item_price = $request->mediumDishPrice;
		$large_item_price = $request->largeDishPrice;
		$extralarge_item_price = $request->extralargeDishPrice;

		$query = $this->Akkieverfresh->submitItemWithRate($cat,$item,$regular_item,$small_item,$medium_item,$large_item,$extralarge_item,$regular_item_price,$small_item_price,$medium_item_price,$large_item_price,$extralarge_item_price);
		return $query;
	}

	public function get_Category_List_get() {
		$res['categories'] = $this->Akkieverfresh->get_Category_List();
		$this->response($res);
	}

	public function getItemDetail_post() {
		$postdata = file_get_contents("php://input");
		$request  = json_decode($postdata);
		$itemcode = $request->itemCode;
		$query = $this->Akkieverfresh->getItemDetail($itemcode);
		$this->response($query);
	}

	public function get_categories_from_database_get() {
		$res['categories'] = $this->Akkieverfresh->get_categories_from_database();
		$this->response($res);
	}

	public function get_catwise_food_items_from_database_get($catId = 0) {
		if ($catId == 0) {
		} else {
			$res['foodItems'] = $this->Akkieverfresh->get_catwise_food_items_from_database($catId);
			$this->response($res);
		}
	}
}
?>
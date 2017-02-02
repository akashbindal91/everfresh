<?php
require_once(APPPATH.'/libraries/REST_Controller.php');
class Usernew extends REST_Controller
{
	public function __construct()
	{
		parent::__construct();
		$this->load->model('User_model');
		$this->load->helper('url');
	}

	public function index_get()
	{
		$this->load->view("homepage.html");
	}

	public function articleView_get()
	{
		$this->load->view("articles.html");
	}

	public function updateView_get()
	{
		$this->load->view("update.html");
	}

	public function insertView_get()
	{
		$this->load->view("insert.html");
	}

	public function updateHere_get()
	{
		$this->load->view("update_here.html");
	}

	public function commentView_get()
	{
		$this->load->view("comment.html");
	}

	public function loginView_get()
	{
		$this->load->view("login.html");
	}

	public function signupView_get()
	{
		$this->load->view("signup.html");
	}


	function read_get()
	{
		$data["results"] =$this->User_model->get_all_article();
		$this->response($data);
	}
	function getallcategories_get()
	{
		$data["categories"] =$this->User_model->getallcategories();
		$this->response($data);

	}

	public function getCategoryData_post()
	{
		$postdata = file_get_contents("php://input");
		$request  = json_decode($postdata);
		$categ = $request->categ;
		$query["category_datas"] = $this->User_model->getCategoryData($categ);
		//echo json_encode($query);
		$this->response($query);

	}

	public function getDataForUpdate_post()
	{
		$postdata = file_get_contents("php://input");
		$request  = json_decode($postdata);
		$u_id = $request->u_id;
		$query["article_data"] = $this->User_model->getdataforupdate($u_id);
		//echo json_encode($query);
		$this->response($query);
	}

	public function getDataForComment_post()
	{
		$postdata = file_get_contents("php://input");
		$request  = json_decode($postdata);
		$u_id = $request->u_id;
		$query["article_data"] = $this->User_model->getDataForComment($u_id);
		//echo json_encode($query);
		$this->response($query);
	}

	public function login_post()
	{
		$postdata = file_get_contents("php://input");
		$request  = json_decode($postdata);
		$email = $request->email;
		$password = $request->password;
		$query["login_data"] = $this->User_model->login($email,$password);
		//echo json_encode($query);
		$this->response($query);
	}

	public function lookup_signup_post()
	{
		$postdata = file_get_contents("php://input");
		$request  = json_decode($postdata);
		$name = $request->name;
		$email = $request->email;
		$password = $request->password;
		$query["response"] = $this->User_model->lookup_signup($name,$email,$password);
		//echo json_encode($query);
		$this->response($query);
	}

	public function signup_post()
	{
		$postdata = file_get_contents("php://input");
		$request  = json_decode($postdata);
		$name = $request->name;
		$email = $request->email;
		$password = $request->password;
		$query["signup_data"] = $this->User_model->signup($name,$email,$password);
		//echo json_encode($query);
		$this->response($query);
	}

	public function lookup_login_post()
	{
		$postdata = file_get_contents("php://input");
		$request  = json_decode($postdata);

		$email = $request->email;
		$password = $request->password;
		$query["response"] = $this->User_model->look_login($email,$password);
		//echo json_encode($query);
		$this->response($query);
	}

	public function getUpdateForSomething_get()
	{

		$postdata = file_get_contents("php://input");
		$request  = json_decode($postdata);
		$u_id = $request->u_id;
		$query["update_something"] = $this->User_model->getUpdateForSomething($u_id);
		//echo json_encode($query);
		$this->response($query);
	}

	public function delete_article_post()
	{
		$postdata = file_get_contents("php://input");
		print_r($postdata);
      	$request  = json_decode($postdata);
      	print_r($request);
      	$u_id = $request->u_id;
        $this->User_model->delete_article($u_id);

        //==========================================
        // $data = array('returned: '. $this->delete('id'));
        // $this->response($data);
	}

	public function delete_comment_post()
	{
		$postdata = file_get_contents("php://input");
		print_r($postdata);
      	$request  = json_decode($postdata);
      	print_r($request);
      	$u_id = $request->u_id;
        $this->User_model->delete_comment($u_id);

        //==========================================
        // $data = array('returned: '. $this->delete('id'));
        // $this->response($data);
	}

	// public function insert_article_post()
	// {
	// 	$postdata	= file_get_contents("php://input");
	// 	$request  	= json_decode($postdata);
	// 	$writer     = $request->writer;
	// 	$title 		= $request->title;
	// 	$article    = $request->article;
	// 	$categ		= $request->categ;

	// 	$this->User_model->add_article($title,$article,$writer,$categ);
      	//$newData['response'] = "true";
      	//return $newData;

	//}
	public function insert_indexed_article_post()
	{
		$postdata	= file_get_contents("php://input");
		$request  	= json_decode($postdata);
		$writer     = $request->writer;
		$title 		= $request->title;
		$article    = $request->article;
		$categ		= $request->categ;

		$this->User_model->insert_indexed_article($title,$article,$writer,$categ);
	}

	public function update_article_post()
	{
		$postdata = file_get_contents("php://input");
		$request  = json_decode($postdata);
		$article    = $request->article;
		$u_id     = $request->u_id;

       $this->User_model->update_article($article,$u_id);

	}

	public function checkDataForExistence_post()
	{
		$postdata	= file_get_contents("php://input");
		$request  	= json_decode($postdata);
		$title 		= $request->title;
		$details["result"] = $this->User_model->checkDataForExistence($title);
		echo json_encode($details);
	}

	public function commentOnArticle_post()
	{

		$postdata = file_get_contents("php://input");
		$request  = json_decode($postdata);
		$comment    = $request->comment;
		$u_id     = $request->u_id;
		$title     = $request->title;

       $this->User_model->commentOnArticle($comment,$u_id,$title);
	}


	public function showComment_post()
	{
		$postdata = file_get_contents("php://input");
		$request  = json_decode($postdata);
		$story_id = $request->u_id;
		//$story_id = $request->$story_id;
		$query["commented_details"] = $this->User_model->showComment($story_id);
		$this->response($query);
	}

	function getComments_post()
	{
		$postdata = file_get_contents("php://input");
		$request  = json_decode($postdata);
		$story_id = $request->u_id;
		$data["com"] =$this->User_model->getComments($story_id);
		$this->response($data);
	}

	function getrelatedarticles_post()
	{
		$postdata = file_get_contents("php://input");
		$request  = json_decode($postdata);
		$categ = $request->categ;
		$data["categs"] =$this->User_model->getrelatedarticles($categ);
		$this->response($data);
	}

	public function getall_post()
	{
		$postdata = file_get_contents("php://input");
		$request  = json_decode($postdata);
		$u_id = $request->u_id;
		$query["datas"] = $this->User_model->getall($u_id);
		$this->response($query);
	}
}
?>

<?php
class User_model extends CI_Model
{
  	public function __construct()
  	{
		parent::__construct();
		$this->load->database(); 
		$this->load->model('User_model');
		$this->load->helper('url');
  	}
  	
	// public function record_count()
	// {
	//   return $this->db->count_all("blog_angular");
	// }

	public function get_all_article()
	{
		$this->db->order_by("u_id","desc");
	    $query = $this->db->get("indexed_blog_article");
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

	public function getallcategories()
	{
		$this->db->select("category");
		$this->db->group_by("category");
		$query = $this->db->get("indexed_blog_article");

	    if ($query->num_rows() > 0) 
	    {
	    	//$query = array_unique($query);
	        foreach ($query->result() as $row) 
	        {
	            $data[] = $row;
	        }
	     	return $data;
	    }
	    return false;
	}

	public function getCategoryData($categ)
	{	
		$this->db->select('*');
		$this->db->order_by("u_id","desc");
		$this->db->where("category",$categ);
	    $query = $this->db->get("indexed_blog_article");
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

	public function lookup_signup($name,$email,$password)
	{
		$this->db->select('*');
		//$this->db->order_by("u_id","desc");
		$this->db->where("user_email",$email);
	    $query = $this->db->get("blog_user_details");
	    if ($query->num_rows() > 0) 
	    {
	    	return false;
	    }
	    else
	    {
	    	$data = array('user_email' => $email,'user_password' => $password, 'name' => $name);
	    	$this->db->insert('blog_user_details', $data);
	    	return true;
	    }

	}

	public function look_login($email,$password)
	{
		$data = array('user_email' => $email,'user_password' => $password);
		$this->db->select('*');
		//$this->db->order_by("u_id","desc");
		$this->db->where($data);
	    $query = $this->db->get("blog_user_details");
	    if ($query->num_rows() > 0) 
	    {
	    	return true;	    	
	    }
	    else
	    {
	    	return false;
	    }

	}

	public function add_article($title,$article,$writer,$categ)
	{
		$data = array('title' => $title, 'article' => $article,'writer' => $writer,'category' => $categ);
  		$this->db->insert('blog_angular',$data);
	}

	public function insert_indexed_article($title,$article,$writer,$categ)
	{
		$data = array('title' => $title, 'article' => $article,'writer' => $writer,'category' => $categ);
  		$this->db->insert('indexed_blog_article',$data);
	}

	public function signup($name,$email,$password)
	{
		$data = array('user_name' => $name, 'user_email' => $email,'user_password' => $password);
  		$this->db->insert('blog_user_details',$data);
	}

	public function delete_article($u_id)
	{
		$this->db->where("u_id",$u_id);
    	$this->db->delete('indexed_blog_article');
	}

	public function delete_comment($u_id)
	{
		$this->db->where("story_id",$u_id);
    	$this->db->delete('	indexed_blog_comment_on_article');
	}

	public function update_article($article,$u_id)
	{
		$data = array('article'  =>$article);
	    $this->db->set($data);
	    $this->db->where("u_id",$u_id);
	    $this->db->update('indexed_blog_article',$data);
	}

	public function getDataForUpdate($u_id)
	{
		$this->db->select('*');
	    $this->db->where("u_id", $u_id);
	    $query = $this->db->get("indexed_blog_article");
	    if ($query->num_rows() == 1)
	    {
	      return $query->result();
	    } 
	    else
	    {
	      return false;
	    }
	}

	public function getUpdateForSomething($u_id)
	{
		$this->db->select('*');
	    $this->db->where("u_id", $u_id);
	    $query = $this->db->get("indexed_blog_article");
	    if ($query->num_rows() > 0)
	    {
	      return $query->result();
	    } 
	    else
	    {
	      return false;
	    }
	}

	public function getall($u_id)
	{
		$this->db->select('*');
	    $this->db->where("u_id", $u_id);
	    $query = $this->db->get("indexed_blog_article");
	    if ($query->num_rows() > 0)
	    {
	      return $query->result();
	    } 
	    else
	    {
	      return false;
	    }
	}

	public function getDataForComment($u_id)
	{
		$this->db->select('*');
	    $this->db->where("u_id", $u_id);
	    $query = $this->db->get("indexed_blog_article");
	    if ($query->num_rows() == 1)
	    {
	      return $query->result();
	    } 
	    else
	    {
	      return false;
	    }
	}
	
	public function checkDataForExistence($title)
	{
		$this->db->select('u_id');
		$this->db->where("title", $title);
		$query = $this->db->get("indexed_blog_article");
		if ($query->num_rows() > 0)
		{
			return $query;
		} 
		else
		{
			return false;
		}
	}

	public function commentOnArticle($comment,$u_id,$title)
	{
		$data = array('comment_is'  =>$comment,'comment_title'  =>$title,'story_id'  =>$u_id );
	    $this->db->insert('	indexed_blog_comment_on_article',$data);
	}

	public function showComment($story_id)
	{
		$this->db->select('*');
		$this->db->order_by("commented_on","desc");
	    $this->db->where("story_id", $story_id);
	    $query = $this->db->get("	indexed_blog_comment_on_article");
	    if ($query->num_rows() > 0)
	    {
	      return $query->result();
	    } 
	    else
	    {
	      return false;
	    }
	}

	public function getComments($story_id)
	{
		$this->db->order_by("u_id","desc");
		$this->db->where("story_id", $story_id);
	    $query = $this->db->get("	indexed_blog_comment_on_article");
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

	public function getrelatedarticles($categ)
	{

		$this->db->order_by('rand()');
	    $this->db->limit(4);
	    $this->db->where("category", $categ);
	    $query = $this->db->get('indexed_blog_article');
	    return $query->result_array();
	    // if ($query->num_rows() > 0) 
	    // {
	    //     foreach ($query->result() as $row) 
	    //     {
	    //         $data[] = $row;
	    //     }
	    //  	return $data;
	    // }
	    // return false;
	}
}
?>
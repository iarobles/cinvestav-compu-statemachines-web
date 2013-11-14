package cinvestav.compu.statemachines.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import cinvestav.compu.statemachines.ProjectConstants;
import cinvestav.compu.statemachines.ProjectProperties;

public class HomeRedirectServlet extends HttpServlet {

    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    private static final Logger log = Logger.getLogger(HomeRedirectServlet.class);

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String url;

        url = ProjectProperties.getInstance().getString(ProjectConstants.AJAX_HOME_URL);

        log.debug("will forward to" + url);
        request.getRequestDispatcher(url).forward(request, response);
        //response.sendRedirect(url);        
    }

}

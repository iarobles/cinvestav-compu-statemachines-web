package cinvestav.compu.statemachines;

import org.apache.log4j.Logger;

import cinvestav.compu.statemachines.ProjectConstants;

import java.io.File;
import java.io.FileInputStream;
import java.util.Properties;

public class ProjectProperties {

    private static ProjectProperties theInstance = new ProjectProperties();

    private static final Logger log = Logger.getLogger(ProjectProperties.class);

    private Properties theProperties = null;

    //IMPORTANT!! for some awkward reason you can't use an static instance of log4j in a constructor in java
    //this is an error that is not detected by the compiler and it's really hard to find out
    private ProjectProperties() {

        try {

            theProperties = new Properties();

            System.out.println("loading properties file from:" + ProjectConstants.PROPERTIES_FILE_PATH);
            theProperties.load(new FileInputStream(new File(ProjectConstants.PROPERTIES_FILE_PATH)));
            System.out.println("properties file loaded :)");

        } catch (Exception e) {
            System.err.println("error while loading CoverLetterProperties!");
            e.printStackTrace();
        }

    }

    public synchronized static ProjectProperties getInstance() {
        if (theInstance == null) {
            theInstance = new ProjectProperties();
        }
        return theInstance;
    }

    public String getPassword(String key) {
        return theProperties.getProperty(key);
    }

    public String getString(String key) {

        String theValue = theProperties.getProperty(key);
        if (log.isDebugEnabled()) log.debug("property:" + key + " has value:" + theValue);

        return theValue;
    }

    public Integer getInteger(String key) {
        Integer theValue = null;

        try {
            theValue = Integer.parseInt(theProperties.getProperty(key));
        } catch (Exception e) {
            log.error("an ", e);
        }

        if (log.isDebugEnabled()) log.debug("property:" + key + " has value:" + theValue);

        return theValue;
    }

    public Boolean getBoolean(String key) {
        Boolean theValue = null;

        try {
            theValue = Boolean.parseBoolean(theProperties.getProperty(key));
        } catch (Exception e) {
            log.error("an ", e);
        }

        if (log.isDebugEnabled()) log.debug("property:" + key + " has value:" + theValue);

        return theValue;
    }

    //in some weird cases(high traffic), this method could be the cause of NullPointerExceptions
    public void resetProperties() {
        log.info("will reset properties");
        theInstance = null;
    }
}
